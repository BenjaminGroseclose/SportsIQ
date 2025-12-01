FROM mcr.microsoft.com/mssql/server:2022-latest

ENV ACCEPT_EULA=Y
ENV MSSQL_PID=Developer

# Create a directory for the dacpac
WORKDIR /var/opt/mssql/deploy

# Copy the dacpac from your build output
COPY bin/Debug/FantasyForge.Database.dacpac ./FantasyForge.Database.dacpac

# Copy deployment script
COPY deploy-dacpac.sh ./deploy-dacpac.sh

# Make the script executable
USER root
RUN apt-get update
RUN apt-get install -y wget unzip
RUN wget -O sqlpackage.zip "https://aka.ms/sqlpackage-linux"
RUN unzip sqlpackage.zip -d /opt/sqlpackage
RUN chmod +x /opt/sqlpackage/sqlpackage
RUN mkdir -p /opt/mssql-tools/bin
RUN ln -s /opt/sqlpackage/sqlpackage /opt/mssql-tools/bin/sqlpackage
RUN chmod +x ./deploy-dacpac.sh
USER mssql

# Expose SQL Server port
EXPOSE 1433

# Start SQL Server and deploy dacpac
CMD  sleep 20 && ./deploy-dacpac.sh & /opt/mssql/bin/sqlservr