from DirtRally2Logging import DirtRally2LoggingServer

log = DirtRally2LoggingServer()
try:
    log.shutdown_send()
except:
    exit()