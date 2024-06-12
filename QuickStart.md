# PowerShell Enable
 in vscode you will have to create a Terminal Profile with these args by adding below in User Settings or in Workspace Settings (ctrl + shift + p and type "settings json")

 ```json
{
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "hediet.vscode-drawio.resizeImages": null,
    "workbench.editor.enablePreview": false,
    "editor.renderWhitespace": "all",
    "terminal.integrated.profiles.windows": {
        "PowerShell": {
          "source": "PowerShell",
          "icon": "terminal-powershell",
          "args": ["-ExecutionPolicy", "Bypass"]
        }
      },
}
 ```
Need to restart VS Code and the Terminal.

# Installs fnm (Fast Node Manager) on Windows
winget install Schniz.fnm
# Shell Setup
Add the following to the end of your profile file:

```powershell
fnm env --use-on-cd | Out-String | Invoke-Expression
```

- For macOS/Linux, the profile is located at `~/.config/powershell/Microsoft.PowerShell_profile.ps1`
- On Windows to edit your profile you can run this in a PowerShell
  ```powershell
  notepad $profile
  ```

# download and install Node.js
fnm use --install-if-missing 20
# verifies the right Node.js version is in the environment
node -v # should print `v20.14.0`
# verifies the right NPM version is in the environment
npm -v # should print `10.7.0`

# Update Dataform
npm i
# Update Dataform Core
npm i -g @dataform/core@^2.8.2

# Create Credentials file
- Create Credentials file with command *dataform init-creds*

```terminal
dataform init-creds
[1] US (default)
[2] EU
[3] other

Enter the location of your datasets [1, 2, 3]: 3
Enter the location's region name (e.g. 'asia-south1'):
> asia-southeast1

[1] ADC (default)
[2] JSON Key

Do you wish to use Application Default Credentials or JSON Key [1/2]: 2
Please follow the instructions at https://docs.dataform.co/dataform-cli#create-a-credentials-file/
to create and download a private key from the Google Cloud Console in JSON format.
(You can delete this file after credential initialization is complete.)

Enter the path to your Google Cloud private key file:
> C:\path\to\service\account\serviceaccount.json

Running connection test...

Credentials test query completed successfully.

Credentials file successfully written:
  C:\path\to\project\dataform-scd\.df-credentials.json
To change connection settings, edit this file directly.
```

# Install dataform to the project
```terminal
dataform install
```

# View compilation output
Dataform compiles your code in real time.

- To view the output of the compilation process in the terminal, run the following command:
```terminal
dataform compile
```

- To view the output of the compilation process as a JSON object, run the following command:
```terminal
dataform compile --json
```

- To view the output of the compilation with custom compilation variables, run the following command:
```terminal
dataform compile --vars="SAMPLE_VAR=SAMPLE_VALUE,foo=bar"
```

- Replace the following:
    - SAMPLE_VAR: your custom compilation variable.
    - SAMPLE_VALUE: the value of your custom compilation variable.

# Execute code
To execute your code, Dataform accesses BigQuery to determine its current state and tailor the resulting SQL accordingly.

- To execute the code of your Dataform project, run the following command:
```
dataform run
```

- To execute the code of your Dataform project in BigQuery with custom compilation variables, run the following command:
```
dataform run --vars=SAMPLE_VAR=SAMPLE_VALUE,sampleVar2=sampleValue2
```
- Replace the following:
    - SAMPLE_VAR: your custom compilation variable.
    - SAMPLE_VALUE: the value of your custom compilation variable.

- To execute the code of your Dataform project in BigQuery and rebuild all tables from scratch, run the following command:
```
dataform run --full-refresh
```
Without --full-refresh, Dataform updates incremental tables without rebuilding them from scratch.


- To see the final compiled SQL code tailored to the current state of BigQuery, without executing it inside BigQuery, run the following command:
```
dataform run --dry-run
```

# Get help
- To list all of the available commands and options, run the following command:
```
dataform help
````

- To view a description of a specific command, run the following command:
```
dataform help COMMAND
```
    Replace COMMAND with the command you want to learn about.