#!/bin/bash
/opt/sqlpackage/sqlpackage \
  /Action:Publish \
  /SourceFile:/var/opt/mssql/deploy/SportsIQ.Database.dacpac \
  /TargetServerName:localhost \
  /TargetDatabaseName:SportsIQ \
  /TargetTrustServerCertificate:true \
  /TargetUser:sa \
  /TargetPassword:$SA_PASSWORD