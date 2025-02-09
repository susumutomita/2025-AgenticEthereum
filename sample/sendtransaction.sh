#!/bin/bash
# filepath: /Users/susumu/2025-AgenticEthereum/sample/sendtransaction.sh

if [ -z "$PRIVATE_KEY" ]; then
  echo "Error: PRIVATE_KEY environment variable must be set."
  echo "Example: export PRIVATE_KEY=YOUR_PRIVATE_KEY"
  exit 1
fi

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <value>"
  echo "Example: $0 0.01ether"
  exit 1
fi

VALUE=$1

cast send 0xf25b72298d0655D968d53a88509D8fFf4E6fb3fd "stake()" --value "$VALUE" --private-key "$PRIVATE_KEY" --rpc-url https://sepolia.base.org
