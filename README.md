# Apex QueryMore Example
An example that demonstrates a method for building QueryMore functionality in Apex to achieve infinite scrolling capabilities without relying on the SOQL OFFSET keyword and the limits that come with it. This technique can also be applied to other use cases where SOQL queries need to be fetched in chunks.

## Installation via SFDX

1. Create a scratch org:
```
sfdx force:org:create -s -f config/project-scratch-def.json -a query-more-example
```

2. Push the app to your scratch org:
```
sfdx force:source:push
```

2. Assign the **QueryMore Data Table Example** permission set to the default user:
```
sfdx force:user:permset:assign -n QueryMore_Data_Table_Example
```

4. Open the scratch org:
```
sfdx force:org:open
```

5. In App Launcher, select the **QueryMore Data Table Example** app.
