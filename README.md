# Apex QueryMore Example
An example that demonstrates a technique for building "QueryMore" like functionality in Apex.

The example showcases a table with infinite scrolling capabilities that retrieves records from the Salesforce database without relying on the SOQL OFFSET keyword. The technique allows for querying of records beyong the OFFSET keyword limit of 2000.

This approach can also be applied to other use cases where large SOQL queries need to be fetched in chunks.

**See this blog post for more information:** https://sfdc.danielzeidler.com/2019/08/18/building-querymore-functionality-in-apex-a-soql-offset-alternative/

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
