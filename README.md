# sovryn-amm-apy

## Overview

This service calculates the apy of the amm pools by retrieving block-by-block data from the graph, aggregating this data into a daily apy for each pool token, and returning this data via REST api to the frontend.

## Methodology

In order to calculate APY, all values are converted into BTC. We chose BTC instead of USD as since most pools are BTC-based, this would limit the effects of BTC volatility on the APY calculation

For each block:
1. Retrieve block timestamp from the node
2. Retrieve all liquidity pools, balances, and btc price of tokens from the graph
3. Retrieve all conversion events that ocurred in that block for the conversion fee data from the graph
4. Retrieve the SOV liquidity mining rewards per block for each pool token from the graph
5. Parse this data, converting balances, fees and rewards into BTC, and store in the database

Then, aggregate this data per day as a daily APY:
1. Aggregate the block data into a daily APY using the sql query in getDailyAggregatedApy() in src/models/apyBlock.model.ts
2. Store this data in the ApyDay table with primary keys (date, poolToken)
3. A cron job regularly updates/inserts this data so current day APY will always be available

# API

Currently there is just one endpoint, /amm, that returns data for the previous 7 days for all pools. This matches the response body structure of the legacy backend endpoint

## Database Migrations

1. Generate migration
   To make any changes to a database that is already deployed: `export POSTGRES_HOST=<postgres host> && export POSTGRES_PASSWORD=<password> export POSTGRES_DB=<db name> && npm run migrations:generate -- -n <migration name>`

2. Run migration
   After generating a migration, you can run it on a deployed database by running: `npm run migrations:run`
