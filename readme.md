## express-pug-tailwind-typescript-templete

- express-pug
- tailwind-css
- live-reload


#### Steps to setup project
```
$ git clone https://github.com/JavaScriptForEverything/express-pug-tailwind-typescript-templete.git
$ git clone git@github.com:JavaScriptForEverything/express-pug-tailwind-typescript-templete.git
```

``` 
yarn install
yarn build
yarn start

yarn dev
browser: 	http://localhost:5000
```


### Dockerizing
```
$ sudo systemctl start docker.service docker.socket
$ docker image build -t javascriptforeverything/frontend:latest .
$ docker image ls

$ docker run -d --name frontend -p 5000:5000 javascriptforeverything/frontend:latest 
$ docker container ps -a 

browser: 	http://localhost:5000


$ docker container rm -f frontend 
$ docker container ps -a 
```


### Microservices
- Create Pod (Deployment)
- Create service for Pod (Deployment)
- Connect with Ingress Service Controller

#### creating Deployment
```
--- # Same as auth-deploy.yaml: just changed names & image
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend                   # (2) select Pod to apply replicas
  template:
    metadata:
      labels:
        app: frontend                 # (1) Add label to pod
    spec:
      containers:
        - name: frontend
          image: javascriptforeverything/frontend:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5000       # App running on this port
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  type: ClusterIP
  selector:
    app: frontend                     # (3) target pod to apply service
  ports:
  - name: 5000-5000
    targetPort: 5000              # (4) map container pod
    port: 5000                    # (5) with Cluster node port 
    protocol: TCP
...
```


#### Connect with Ingress Service Controller
```
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-svc            # will be used as dns to access ingress service
  annotations:
    # nginx.ingress.kubernetes.io/use-regex: 'true'       # required for regex
spec:
  ingressClassName: nginx   # apply nginx-ingress controller
  rules:
  - host: mydomain.com      # echo '127.0.0.1   mydomain.com' | sudo tee -a /etc/hosts
    http:
      paths:
      # - path: /api/users/?(.*)
      - path: /api/users/
        pathType: Prefix
        backend:
          service:
            name: auth-svc      # target service.name = auth-svc to apply
            port:
              number: 5000      # app running on container and also service mapped to 5000

			# Connect with Ingress Service Controller
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc  # target service.name = frontend-svc to apply
            port:
              number: 5000      # app running on container and also service mapped to 5000
...
```