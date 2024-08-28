# Container

## Why the Client Container?
In the Single Page Application pattern, different applications will be available from the same entry point.
A management of the resources (E.g libraries) is required when the user moves from one application to another.
Also, the container improves usability of the UI providing support in the case of a Not Found application.

## What is the Client Container?
The client container is the runtime container for client apps.
It is the implementation of the Single Page Application pattern so it has the only index.html.
All OSS apps are loaded by the container and the container is responsible for managing their lifecycle.

## Who is this for?
The client container also provides some common services to apps including logout and a help menu.

**For Docs, pre-packed downloads and everything else see**:
[Client Container Docs](https://arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/tor/uisdkcontainer/latest/index.html).