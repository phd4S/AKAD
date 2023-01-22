# MongoDB Server (x3 als ReplicaSet) aufsetzen

Damit kann man die Quellcodebeispiele nachvollziehen und selbst etwas experimentieren.

## Docker installieren
- Entweder als [Docker Desktop für Windows](https://www.docker.com/products/docker-desktop/)
- oder als Packat unter Linux z.B. Ubuntu: "sudo apt install docker.io"
- oder manuell (z.B. mit [VirtualBox](https://www.virtualbox.org/) und z.B. [Alpine Linux](https://www.alpinelinux.org/downloads/), mit nachfolgendem Skript:

      VM via Alpine Linux (alpine-virt-3.17.1-x86_64)
      VirtualBox: Linux (64-bit), 4096 MB, 4 CPUs, 80 GB VDI, No Audio, NAT, USB-1.1
      # setup-alpine
      # reboot (remove ISO)
      # vi /etc/apk/repositories (enable community)
      # apk update
      # apk add sudo bash htop
      # apk add docker docker-compose
      # rc-update add docker default
      # service docker start
      # addgroup docker docker
      # visudo (docker ALL=(ALL:ALL) ALL)
      # vi /etc/passwd (docker:*:/bin/bash)


## MongoDB Server deployen

      docker network create mongo-cluster
      
      docker volume create mongo1_data mongo1_config
      docker volume create mongo2_data mongo2_config
      docker volume create mongo3_data mongo3_config
      
      docker run -d -p 30001:30001 --name mongo1 --net mongo-cluster -v mongo1_data:/data/db -v mongo1_config:/data/configdb mongo mongod --replSet rs1 --port 30001
      docker run -d -p 30002:30002 --name mongo2 --net mongo-cluster -v mongo2_data:/data/db -v mongo2_config:/data/configdb mongo mongod --replSet rs1 --port 30002
      docker run -d -p 30003:30003 --name mongo3 --net mongo-cluster -v mongo3_data:/data/db -v mongo3_config:/data/configdb mongo mongod --replSet rs1 --port 30003
      
      Evtl. in der VM dann nicht vergessen, die Ports 30001 bis 30003 per NAT freizugeben.


## ReplicaSet konfigurieren

      docker exec -it mongo1 mongosh --port 30001

      test> db = (new Mongo('localhost:30001')).getDB('test')
      test> config = { _id: 'rs1', members: [
            { _id: 0, host: 'mongo1:30001' },
            { _id: 1, host: 'mongo2:30002' },
            { _id: 2, host: 'mongo3:30003' }
          ]}
      test> rs.initiate(config)
      test> rs.status()

## Client installieren

Man könnte natürlich mit der MongoDB Shell (docker exec -it mongo1 mongosh --port 30001) arbeiten, aber bequemer geht es mit einem MongoDB GUI Client

- z.B. [Studio 3T](https://studio3t.com/)
