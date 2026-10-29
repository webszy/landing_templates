#!/bin/sh
# Chrome wrapper for machines where Chrome's own sandbox cannot initialize
# ("sandbox initialization failed: Operation not permitted" — the browser then
# dies before the first CDP command). pingfusi launches Chrome without a
# --no-sandbox escape hatch, so point it at this wrapper instead:
#
#   PPK_CHROME="$PWD/scripts/chrome-nosandbox.sh" pingfusi capture-run <name>
#
# Every argument pingfusi passes is forwarded unchanged; only the sandbox flag
# is added, so measurement behaviour stays identical.
exec "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --no-sandbox "$@"
