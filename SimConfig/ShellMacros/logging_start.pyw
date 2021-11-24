from DirtRally2Logging import DirtRally2LoggingServer

log = DirtRally2LoggingServer()
try:
    log.logging_connect()
    log.shutdown_connect()

    log.logging_start()
except:
    exit()
