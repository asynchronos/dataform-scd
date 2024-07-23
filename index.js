/**
 * (Draft version) Builds a type-2 slowly changing dimensions table and view.
 */
module.exports = (
  name,
  { uniqueKey, hash, dataDate, importDate, source, tags, incrementalConfig, columns = {} }
) => {
// Create an incremental table with just pure updates, for a full history of the table.
const updates = publish(`${name}_updates`, {
  type: "incremental",
  tags,
  columns,
  ...incrementalConfig,
}).query(
  !!hash ?
     (ctx) => `
  ${ctx.when(
        ctx.incremental(), `with ids_to_update as \
      (select ${uniqueKey}, ${hash}  from ${ctx.ref(source)}\
      except distinct \
      (select ${uniqueKey}, ${hash} from ${ctx.self()}\
         qualify row_number() over (partition by ${uniqueKey}, ${hash} order by ${dataDate} desc) = 1))`
    )}
    select * from ${ctx.ref(source)}
    ${ctx.when(
        ctx.incremental(),
        `where \
              -- ${dataDate} > IFNULL((select max(${dataDate}) from ${ctx.self()}), TIMESTAMP_SUB(${dataDate}, INTERVAL 1 SECOND))
              -- and 
              ${uniqueKey} in (select ${uniqueKey} from ids_to_update)`
    )}`
  :
(ctx) => `
    select * from ${ctx.ref(source)}
    ${ctx.when(
      ctx.incremental(),
      `where ${dataDate} > (select max(${dataDate}) from ${ctx.self()})`
    )}`
);


// Create a view on top of the raw updates table that contains computed valid_from and valid_to fields.
const view = publish(name, {
  type: "view",
  tags,
  columns: {
    ...columns,
    scd_valid_from: `The timestamp from which this row is valid for the given ${uniqueKey}.`,
    scd_valid_to: `The timestamp until which this row is valid for the given ${uniqueKey}, or null if this it the latest value.`,
    del_flag: 'del flag'
  },
}).query(
    (ctx) => `
select
  *,
  ${dataDate} as scd_valid_from,
  TIMESTAMP_SUB(lead(${dataDate}) over (partition by ${uniqueKey} order by ${dataDate} asc), INTERVAL 1 SECOND) as scd_valid_to
  ,CASE WHEN ${dataDate}=lead(${dataDate}) over (partition by ${uniqueKey} order by ${dataDate} asc) THEN 'Yes' ELSE null END as del_flag
from
  ${ctx.ref(updates.proto.target.schema, `${name}_updates`)}
qualify row_number() over (partition by ${uniqueKey},${dataDate} order by ${importDate} desc) = 1`
);

// Returns the tables so they can be customized.
return { view, updates };
};