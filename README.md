# My Transphormation Starts Today

This repository holds the source code for the Ionic application: "My Transphormation".

This application was originally commissioned by 1st Phorm to manage their My Transphormation Starts Today challenges. The challenge is a contest which occurs 4 times a year. Each challenge is 8 weeks long. Transphormers sign up during the intial sign-up period of 1-2 weeks.

## Live Urls
- iOS: https://apps.apple.com/us/app/1st-phorm/id1445819600
- Android: https://play.google.com/store/apps/details?id=com.firstphorm.apps&hl=en_US&gl=US

## Requirements

- Node (10.x)
- npm (or yarn)
- Cordova (9.x)
- XCode (for building iOS)
- Android Studio (for building Android)
- Ionic CLI (5.4.x)

This application currently uses Ionic v4 with a Laravel API backend. It deploys to both the web and to the application itself.

The Laravel backend currently v5.8.

## Pre Setup instructions

- Install ionic cli 5

```sh
npm install -g ionic@5.2.x
```

## Setup

- Clone the project
- Run the following command to install dependencies

```sh
yarn install --frozen-lockfile
```

- Copy the **src/environment.example.ts** as **src/environment/environment.ts**

```sh
cp src/environment/environment.example.ts src/environment/environment.ts
```

- Change/setup correct values in the **src/environment.ts**.

- Use the following command to start the development server

```sh
ionic serve
```

## Configuration

Please review the information in the `src/environments/environment.ts.sample` file if
you have questions about configuration.

- **appUrl**: Should be a URL that points to an API endpoint. It will include
  a version (e.g. `v2`) end with a '`/`' E.g. "`http://endpoint.dev/api/v1.1/`".
- **clientId**: Will be a string (containing a number) that points to the ID of the
  OAuth secret used on our server to handle authentication. This will need to be
  provided to you but usually in our Slack channel the latest server's configuration
  will be posted.
- **clientSecret**: A secret key used for authentication of this particular
  application to the API server.
- **pusher**: This configuration is managed by our build process. If you need to
  test this, you will need to contact Nick since this configuration is not published
  and it is API-server dependent.
- **mux_data_key**: This key is used when returning data back to the MUX video API.
  It can be safely ignored in non-production environments. If needed for testing, please
  ask Nick.
- **nutritionix**: There is no non-production configuration, please refer to the
  development configuration stored in Slack.

## iOS/Android setup

- First setup the platforms if not already added using the command

```sh
ionic cordova platform add ios
ionic cordova platform add android
```

- OR if platform is already added then setup platform specific binaries as follows

```sh
ionic cordova prepare ios
ionic cordova prepare android
```

- The above points will setup the platform files but XCode and Android Studio are required for running/building the app
  natively.

## Route Setup for Laravel Application

In order to sync routes of Ionic app with Laravel the **routes.config.ts** needs to be executed using the following
command:

```sh
node_modules/ts-node/dist/bin.js routes.config.ts
```

This in return will generate a **routes.json** containing the equivalent route naming for Laravel. This needs to be
symbolically linked to the Laravel application in the folder **storage/app/public** from the root of the Laravel
application.

The Laravel application will then read the file and generate the routes equivalent to resolve the routes listing. Note
that this doesn't have to be done locally. The API will work without doing this.

# Terms

**Transphormer** a term synonymous with "user". All "users" of the application are considered **Transphormers**.
**Advisor** also sometimes called _Legionnaire_ is a term which refers to a user who has extended application access to features specifically for Advisors. Advisors can chat with their Transphormers, review all of their information, look at Assessments, and a number of other pieces of information. Advisors **must** be premium users in order to access Advisor-related functionality. Someimes they are referred to as **Trainers** although that was their original name, the correct name is Advisor.

# Premium Functionality

Some pieces of functionality are gated:

- Chat
- Live Streams
- Body Metrics

All Advisor functionality is not shown at all until all of the following is true:

1. The user is Premium
2. The user's Trainer record (on the server) as been created
3. Finally, the user's Trainer record's status is ACTIVE (1) and not INACTIVE (0).

# Application Structure

There are 6 major functionality areas within the app itself:

- Onboarding
- Nutrition
- Workouts
- Body Metrics & Weigh-Ins
- Messaging
- Updates
- Live Streams
- Advisor Backend

Minor features:

- Go Premium
- Dashboard
- Announcements
- Profile
- Settings
- Notifications

# Onboarding

Onboarding gets the user into the application, gets initial information about body profile and sets up the application for general usage.

Onboarding includes a flow that takes users through creating an account:

- New User, Profile Incomplete - In this state they have created an account, but have not filled out any of the details. We have their name and their email address.
- Profile Completed, Ready to onboard - At this point, we have all of their information and they can begin to use the app.

During onboarding, we will determine, based on their responses, whether or not they ought to go Premium. If they do, then we take them to onboarding and _then_ they are taken thru the walkthrough.

The walkthrough just walks them through the basic usage of the application.

They will answer questions related to setting up Nutrition as well as setting up a workout.

# Nutrition

There are two forms of nutrition. Simple nutrition allows users to log a small number of foods from a limited list. Simple nutrition is "Phase 1" and "Phase 2" out of the 3 major phases of how 1st Phorm considers the nutrition to need to be done by Transphormers. It also gives them the ability to log their stack of up to 8 different supplements that 1st Phorm provides.

## Portion Control / Phase 1

Portion control limits food to palm/fist/fist side portions of protein, carbs, and vegetables, respectively. They teach this to their legionnaires and to people who are doing the program. Phase 1, therefore, just allows the user to do this. Transphormers are limited to 3 meals per day in this method.

This program can be done by anyone at any time and doesn't depend on any factors from the user to calculate anything.

## Meal Planning / Phase 2

Once someone has gotten used to Phase 1, they will likely want to move to Phase 2, which helps them to get better results by tuning their intake to specific amounts based on their goals and existing weight.

This plan takes into account their weight, goal weight, sex, and number of meals that user is wanting to eat per day. It provides them specific amounts of foods for a set number of emals.

## Calorie / Macro Counting / Phase 3

This provides the user with an extended amount of control over their nutrition options. We generate macros that take into account 6 different factors and then give them the ability to free log any foods from the database.

The database we use is from a company called Nutritionix. One thing that Nutritionix requires is that for every time a food is logged, we are supposed to reach out to their database. Therefore, if a user is re-logging some food that was entered previously, we'd need to know what the food is that is being re-logged, look it up again from Nutritionix, and then we can add it back into the database.

Here are the different types of food items:

| Type         | Description                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Common item  | These are Nutritionix "common items". They are searched for differently than branded items                                                                                                                                   |
| Branded item | These are Nutritionix "branded items". They are searched for differently than common items and usually include additional information                                                                                        |
| Custom items | These are foods which are completely custom. They are added by hand by the user and include basic serving information which allows us to be able to calculate the final macros for a food once it is added to the daily log. |
| Meals        | These are not individual items but rather are "groupings" of one or more of the food types above.                                                                                                                            |

Foods and meals are loaded from APIs. When a search is done (or even just loading a default result), there are 4 APIS:

| API                    | Non-search | Search |
| ---------------------- | ---------- | ------ |
| Recent food items      | √          |        |
| Around this time items | √          |        |
| Meals                  |            | √      |
| Nutritionix            |            | √      |

Recent food and around this time items show up on the default screen. Meals and Nutritionx search values only show up on the search results listing.

# Workouts

When a user onboards, they answer a number of questions about their workout. The two main questions are: Are you working out at home? And what type of workout do you want to do? Additionally, they answer a question like "how often do you work out?"

When these questions are answered, it allows us to build a profile which ties them to a **Training Program**. A training program is set up on the server and runs for a particular set of dates. If a user has a _Beginner_, _Traditional_ workout profile, then any workout which matches for the Beginner, Traditional workout profile will be shown to them.

Every time the application loads a workout, it pulls a workout for a single date. Since the API knows who they are, the API looks up which Training Program they ought to have and shows them the correct workout. If no workout is available, the API will return an error.

Users can switch their workouts by editing their profiles.

1st Phorm continually updates and maintains these workouts using the server platform.

Logic to determine which items are paid vs. free is stored both on the server and on the local application since the profile and onboarding systems denote that a particular type of workout is free vs. paid.

## Switching to At-home

Premium users who are not using at-home workouts can "switch" over to an at-home workout. There is an API call for this that does the switch.

# Body Metrics & Weigh-Ins

Originally when the app launched we only had Weigh-ins. Now we have body-metrics as well, which allows users to record inch/cm measurements of selected body regions.

Weigh-ins & BM tie into a couple of important areas in the app:

- For people with custom macros, we note the current weight when the custom macros are saved and then when the macros are changed, we see if the user has changed more than 10lbs and alert them to update their macros.
- When weigh-ins are deleted, we update the first weigh-in weight (if the weigh-in deleted was the first one.
- The user must have at least one weigh-in. If they attempt to delete the only weigh-in, the API will return an error.

Body metrics and Weigh-ins are stored using a unit and a unit value. Units are either US or Metric. Based on the logged-in user's preference, we show all people's values in the local user's selected views (e.g. if they use US metrics, then we will always show the values in US, even if the values were originally entered in Metric.)

# Messaging

Messaging is a premium feature. If a user does not have Premium, they will be redirected to a "gate" page which prompts them to go premium with custom wording.

Messaging for regular Transphormers uses push notifications when they have them enabled so that they can get notifications while they are outside of the app. While they are logged in, technically they do not get any notifications.

While on the actual chat screen, messages are streamed "live" through Pusher.

Messages can be either plan text or "rich". Rich messages are composed of one or more parts of the following types:

Existing types:

- `text` - Just text.
- `url` - A plain.
- `link` - A plan HTML link.

New types:

- `image` - Image.
- `video` - Video.
- `html` - HTML.

Individual messages can have one or more parts associated with them.

When messages are read, an event is emitted and the application should update the status of the unread messages listing that shows up in the main menu.

# Updates

Users are supposed to submit updates weekly so that they can:

- Participate in the contests.
- Track their own personal progress.

Updates consist of a couple of different things:

- Three images: front, side, and back
- URL
- Text field

Updates are important because they are used in assessments. Updates are only submitted from the apps. They are watermarked and dated on the server themselves. No processing aside from resizing happens on the app themselves.

# Live Streaming

The application offers both live streaming and playback of videos. Live streaming is managed through Mux and uses Pusher to live-stream events to the application for starting and managing the live streams and the messaging that goes on during the live streams. Live streams are controlled through the admin interface.

Mux handles the streaming of the HLS streams. It also delivers the stored streams. Video.js is used for the player.

# Advisor Backend

Advisors currently have functionality which allows them to:

- List their Transphormers
- View individual transphormer details
  - View nutrition details
  - View workouts
  - View body metrics & weigh-ins
  - View assessments
  - View updates
- Send out announcements to all or some of their Transphormers
- View and respond to assesssments
- Review and send messages

# Smaller pieces of functionality

## Go Premium

Going premium is an interesting process. When application loads (as of 2.2.0) it refreshes itself before this screen loads. Going Premium loads the products from the internal store and then displays the products on the Go Premium screen.

When a user chooses to Go premium, it fires off an event which then causes the application state to update. When the state updates, it fires off a notification to the server which then will end up loading the latest state from the server. The server is the official source of "truth" for who is Premium.

Essentially, when someone goes Premium, it should update the server by either being notified from Google / Apple directly or by being notified by the Application and then being "force updated" from the backend server.

Additionally, it is possible for a user to "go premium" by having a special flag added to their account. With this flag set, the user will be premium and the application will be updated accordingly to enable or disable premium functionality.

## Dashboard

The dashboard is a bit of a mish-mash functionality right now. It just has a few widgets which combine the workouts, nutrition, and live stream functionality into a single space. It ought to be updated.

## Announcements

These can be sent out by Advisors and are (currently) plain-text but will need to incorporate the richeness of other messages as well.

When read, they update the "unread announcement" tracker within the app through an event which will be emitted.

## Profile

Users can update their profile from this page. Everything except for local application settings and notifications can be configured here.

## Settings

This controls which notifications show up, essentially.

## Notifications

The application sets a number of notifications:

- Workouts (daily, at set time every day)
- Weigh-ins (weekly, on Wednesdays)
- Updates (weekly, on Fridays)
- Live Stream notifications (Premium only)
- Chat notifications (Premium only)

# Other notes

The application is currently being transitioned to using states and observables for it's internal mechanisms. The services also send to use Promises where Observables should be used.
