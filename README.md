## Engineering Challenge

This repository contains solution code for the [backdrop backend engineer assessment](https://backdrop-photo.notion.site/Backdrop-Engineering-Challenge-98d101dec5a04f9ca79b1513901c80b8). Below is documentation on how to use this project and further analysis on the tools used.
You can also skip the long chat and go into the [justification of using the levenshtein distance algorithm over the damerau-levenshtein distance algorithm](https://github.com/arinze19/drops#why-use-a-levenshtein-distance-algorithm-over-the-damerau-levenshtein-distance-algorithm-in-this-scenario) for this problem

### Getting Started

1. Make sure you have [nodejs](https://nodejs.org/en) installed on your local machine
2. clone the repository

```
git clone https://github.com/arinze19/drops
```

3. dig into the project directory

```
cd drops
```

4. Setup your environment variables

```bash
cp ./api/.example.env ./api/.env
```

5. Grab a free API secret key from [paystack developer portal](https://paystack.com/developers) and populate your `.env` files appropriately. **NB:** Ideally, the `DEFAULT_USER` in `.env` should be the name on your registered bank account

6. Change directory into `./api` and run the command `yarn install && yarn start:dev`
7. An interactive graphiql playground should be live and available on the local network `https://localhost:5151/graphql`

### Technologies Used

1. [Typescript](https://typescriptlang.org/) - Almost due to it's ubiquity these days, also provides a good developer experience.
2. [Axios](https://axios-http.com/) - For performing HTTP requests to the paystack API
3. [JS-Levenshtein](https://www.npmjs.com/package/js-levenshtein) - Ready made efficient [levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance) written in javascript
4. [jest](https://www.npmjs.com/package/jest) - Used to run tests

**NB:** Due to the scope and size of this project, I opted to have it's database be more agnostic and implemented a volatile storage service instead of going with a traditional `NoSQL` or `SQL` database - I think this provides more flexibility for writing tests and also helps reviewers/contributors skip writing in their database credentials and get up and running as quickly as possible.

### Assumptions

1. We are making an assumption here to stick to the name ordering we get from paysatck, Meaning `ADEKUNLE CIROMA YUSUF` and `CIROMA ADEKUNLE YUSUF` are **NOT** the same.
2. We are also assuming that the `DEFAULT_USER` should match the `account_name` in order to use the first mutation, this is because we seed the database with this exact user. Perhaps there could be better ways to go about this but the [instructions](https://backdrop-photo.notion.site/Backdrop-Engineering-Challenge-98d101dec5a04f9ca79b1513901c80b8) did not provide much clarity on creating new accounts through this mutation.

### Folder Structure

To enhance readability and understanding of the codebase, the `src` folder has been batched up into `class modules` with a single concern (SOLID principles)

```bash
src 📂
   config 📂 # root configuration file for project
   db 📂 # volatile database service
   gql 📂 # Graphql schema declaration
   helpers 📂 # global helper functions
   mutations 📂 # mutation resolvers
   queries 📂 # query resolvers
   test 📂 # unit tests for resolvers
   types 📂 # type definitions
   server.ts 📄 # main entry point
```

### API

Upon completion of the [Getting started](https://github.com/arinze19/drops#getting-started) guide, the backend should be running on port `5151`. Being a `graphql` project, the backend has `one endpoint`, `two mutuations` and `one query` which serves as add-on to inspect all users in the database.
The mutations and queries are outlined below.

```bash

# mutation one

mutation {
  create(name: "Individuals Name", bank_name: "Banks Name", account_number: "Bank Account Number") {
    id,
    name,
    bank_name,
    account_number,
    is_verified
  }
}

# mutation two

mutation {
  create(account_number: "Account Number", bank_code: "Banks Code") {
    id,
    name,
    bank_name,
    account_number,
    is_verified
  }
}

# query one

query {
  accounts {
    id,
    name,
    bank_name,
    account_number,
    is_verified
  }
}

```

### Tests

Since the resolvers have been batched into separate modules, I have decided to test the resolvers independently from the schema definitions, perhaps this might have some hiccups on larger apps but it's all learning at the end of the day.
To run the tests, input the command

```
yarn start:test
```

### Progress

- [x] Develop resolver to verify user with `account_number`, `bank_name` and `name`.
- [x] Develop resolver to verify user with `bank_code` and `account_number`.
- [x] Write tests.
- [x] Write a short note on why we use pure Levenshtein Distance algorithm as opposed to Damerau-Levenshtein Distance algorithm in this scenario.
- [x] Turn in assumptions.

### Why use a levenshtein distance algorithm over the damerau-levenshtein distance algorithm in this scenario

The fundamental difference between the [levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance) and the [damerau-levenshtein distance algorithm](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) is the addition of transpose operation on characters in the latter, this brings us to a very interesting scenario.<br />
Since in this problem we assume the error in user input to be caused by hastiness, it is efficient to use the levenshten distance algorithm as errors in this category are limited to missing or a mistyped characters (as stated in the [assumptions](https://github.com/arinze19/drops#assumptions), we are assuming the user knows and inputs their name in the correct order which they have in their registered bank). <br />
With a relatively lower runtime than the damerau-levenshtein distance algorithm, it seems like the most efficient algorithm to implement for this problem. However, if we were to implement stricter checks and fraud detection on our program, we could employ the damerau-levenshtein algorithm and perhaps trigger alarms if the account of a registered user -- `CIROMA ADEKUNLE YUSUF` were to accessed as `ADEKUNLE CIROMA YUSUF`.
