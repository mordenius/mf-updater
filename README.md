# mf-updater

Early development part of the framework Manufactura.

Script for updating source and dependencies from a remote host.

___

# NOT READY FOR USAGE

___

## Requirements

### 0. Peer
 - Git as VCS for production revisions of the main program
 - Node js v6 or above 
 - "pm2": "^2.10.2"
### 1. Configuration

The Updater looks at the file on the ```<root>/config/main.config.json``` path, which should contain information for connecting to the server from which the update will be made.
```json
{
  "host": "127.0.0.1",
  "port": 3000 
}
```

### 2. Token

The update server must process the GET request ```/api/updater/token```, the answer to which is the [jsonwebtoken](https://jwt.io/) with follow PAYLOAD:DATA structure:

```json
{
  "repo": "<link to git repository>",
  "commit": "<hash of the commit, which is the must be current>"
}
```

___

## Adding to the main program

1. Copy source code
```
git clone https://github.com/mordenius/mf-updater.git
```

2. Install dependencies
```
npm install
```

3. Pack bundle of the Updater
```
npm prod
```

4. Copy bundle of the Updater inside main program repo:
	- from: ```mf-updater/build/updater.min.js```
	- to: ```<main_program_root>/build/updater.min.js```

5. Launch updater
- Directly
```
node build/updater.min.js
```
- As [pm2](http://pm2.keymetrics.io/) service
```
pm2 start build/updater.min.js --no-autorestart --name "updater"
```
