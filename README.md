# Logixboard Backend Engineering Take-Home Challenge

Thanks for applying to Logixboard! The next step in our process is a coding challenge. Our goals
with this step in the process are the following:

1. To assess your ability to problem solve and develop a well-engineered solution to a user need.
1. To give you an opportunity to show creativity in how you solve a user need.
1. To give us a tool we can use for discussion and collaboration in our synchronous interviews.

We hope and expect that this exercise should take about two hours to complete. If it takes you a
bit more than that, that's okay, and you don't need to tell us. If it takes you a _lot_ more than
that, please let us know so we can reevaluate the exercise for future candidates.

## Assignment

For this challenge, we are asking you to implement some API's on a bootstrapped express server.

**If you are not comfortable with NodeJS/Typescript, feel free to use your own stack.**

### Product Context

Logixboard is a customer engagement tool for freight forwarders to provide their customers with
visibility into their supply chains. You've probably gotten an intro at this point on what a
Freight Forwarder is, but in case you haven't: Freight Forwarders are the project managers of the
logistics world. They don't own any planes, trains, or boats. They are just really good at
coordinating with all the actors to make sure their customers' freight gets from point A to B.

Logixboard's offering has grown into being the primary communication hub between freight
forwarders and their customers. At the core of our product we process and keep up to date large amounts of data.
The goal of this assignment draws inspiration from work we've done.

### Data Ingress APIs

One of the key components to our system is taking in data and storing it in our system in an accurate and timely manner.
We've outlined two POST APIs for you `/shipment` and `/organization`. You'll need to implement these in order
to store the data in a timely and accurate fashion.

A Shipment, as you may have guessed, is some items being moved from A to B, often with some intermediary steps inbetween.
The interesting part is that a Shipment can have zero to many Organizations associated with it. An Organization may be the
party who is shipping the items, receiving the items, or paying for the item. It's important to know which Orgs
are involved with a given shipment. Tracking these Shipment to Org relationships is key in storing the data.

The data model is fairly simple in what you'll receive, you can inspect the data in `messages.ts` to see what they look like. Each message is a **complete snapshot** of the object, ie you are receiving ALL the data for a given object each time, not just what has changed.
Don't worry about tracking intermediary state, or object history, we only care about the most up to date view of a given object.
On organization messages we receive both a unique identifier and a code. **Be warned, the `code` field can change over time!**

Your API should persist or update the given object to maintain accurate data for later access. Feel free to use a persistence layer of your choosing that satisfies the requirements.

Running `npm run send` will hit the appropriate API given the message type. You may use this to test your API.

### Data Egress APIS

Now of course we'd like to use the data we've stored to provide some customer value! Implement the
`/shipments/:id` and `/organizations/:id` APIs so we can get the objects out of storage.

### Weight aggregation

You may have noticed that each Shipment has an array of `Transport Packs` associated with it. Our product team
has asked for us to provide that aggregated data over all Shipments we've now stored.

Your last task is to design and implement an API that allows us to see the total weight of all the Transport Packs
in all shipments. We need to be able to specify what units are desired for the aggregated number. Since there are
mixed units we'll need to convert where necessary.

## Setup

### Dependencies

This app was built with Node.js 15, but it should work with most modern versions of Node.js. If
you run into any hiccups start by making sure you're on Node 15. We encourage the use of a tool
like [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to manage multiple versions and
make sure you're running the correct one.

To install dependencies:

```
npm install
```

To start the development server:

```
npm run start
```

To run the test script:

```
npm run send
```

## Submission

When you are complete, please submit in one of the following ways:

1. Compress the entire directory into any commonly used compression format and return it via
   email
2. Send us a link to a publicly available repository with the code.

We will assess your submission and follow up with next steps.

## Test meguru's code

You can test Meguru's code by the following steps.

1. create a MySQL database: test
2. Restore MySQL dump schema: dump-logixboard.sql
3. Command 'npm install'
4. Creat a .env file under the application root with DB_PASSWORD='*your db password*'
5. Command 'npm run send/start' 
