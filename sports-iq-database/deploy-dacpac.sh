#!/bin/bash
/opt/sqlpackage/sqlpackage \
  /Action:Publish \
  /SourceFile:/var/opt/mssql/deploy/FantasyForge.Database.dacpac \
  /TargetServerName:localhost \
  /TargetDatabaseName:FantasyForge \
  /TargetTrustServerCertificate:true \
  /TargetUser:sa \
  /TargetPassword:$SA_PASSWORD