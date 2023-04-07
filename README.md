## Engineering Challenge

This repository contains solution code for the [backdrop backend engineer assessment](https://backdrop-photo.notion.site/Backdrop-Engineering-Challenge-98d101dec5a04f9ca79b1513901c80b8). Below is documentation on how to use this project and further analysis on the tools used.
You can also skip the long chat and go into the justification of using the levenshtein distance algorithm over the damerau-levenshtein distance algorithm

### Getting Started

1. Make sure you have [nodejs](https://nodejs.org/en) installed on your local machine
2. Setup your environment variables

```bash
cp ./api/.example.env ./api/.env
```

3. Grab a free API secret key from [paystack developer portal](https://paystack.com/developers) and populate your `.env` files appropriately.
   **NB:** Ideally, the `DEFAULT USER` should be the name on your registered bank account
4. Change directory into `./api` and run the command `yarn start:dev`
5. An interactive graphiql playground should be live and available on the local network `https://localhost:5151/graphql`

### Technologies Used

1. [Typescript](https://typescriptlang.org/) - Almost due to it's ubiquity these days, also provides a good developer experience.
2. [Axios](https://axios-http.com/) - For performing HTTP requests to the paystack API
3. [JS-Levenshtein](https://www.npmjs.com/package/js-levenshtein) - Ready made efficient [levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance) written in javascript
4. [jest](https://www.npmjs.com/package/jest) - Used to run tests

**NB:** Due to the scope and size of this project, I opted to have it's database be more agnostic and implemented a volatile storage service instead of going with a traditional `NoSQL` or `SQL` database - I think this provides more flexibility for writing tests and also helps reviewers/contributors get up and running as quickly as possible.

### Assumptions

1. We are making an assumption here to stick to the name ordering we get from paysatck, Meaning `ADEKUNLE CIROMA YUSUF` and `CIROMA ADEKUNLE YUSUF` are **NOT** the same.
2. We are also assuming that the `DEFAULT_USER` should match the `account_name` in order to use the first mutation, this is because we seed the database with this exact user. Perhaps there could be better ways to go about this but the [instructions](https://backdrop-photo.notion.site/Backdrop-Engineering-Challenge-98d101dec5a04f9ca79b1513901c80b8) did not provide much clarity on creating new accounts.

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

Upon completion of the Getting started guide, the backend should be running on port `5151`. Being a `graphql` project, the backend has only `one endpoint`, `two mutuations` and `one query`.
The mutations and schemas are outlined below.

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

```

### Tests

Since the resolvers have been batched into separate modules, I have decided to test the resolvers independently from the mutation definitions, perhaps this might have some hiccups on larger apps but it's all learning at the end of the day.
To run the tests input the command 

```
yarn start:test
```


### Progress

- [ ] Develop endpoint to verify user with `account_number`, `bank_name` and `name`.
- [ ] Develop endpoint to verify user with `bank_code` and `account_number`.
- [ ] Write tests.
- [ ] Write a short note on why we use pure Levenshtein Distance algorithm as opposed to Damerau-Levenshtein Distance algorithm in this scenario.
- [ ] Turn in assumptions.

### Why use a levenshtein distance algorithm over the damerau-levenshtein distance algorithm in this scenario
