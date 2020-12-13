# Dashboard
The goal of this project was to create a dashboard web application. According to the subject, our app needed to handle at least:
- **User management**: The user must be able to *register* and *login* via email / password combinaison OR via *OAuth2* (Microsoft, Twitter etc)
- **Service management**: Since the goal of this application is to display informations from different "services" (such as Microsoft, Reddit etc) the user must be able to *authenticate* (if needed) himself to theses services using *any method* (OAuth2, OAuth, username/password etc). Note that a service can be anything which uses an *API*, authentication is not mendatory for all services.
- **Widget management**: Every service will offers one or more widget. A widget allows the user to *watch* for some data reachable using the associated *service* (emails, subbreddits stats, youtube video stats etc). To be concidered as a valid widget, a widget instance must be *configurable*, *movable* and *deletable*. There must also be a way to configure the time between *two* requests to the associated service, since the goal of a widget is not only to *display* the data, but also to *refresh* it.  

On the technical side, on one hand, we chose to use **Javascript**, **Express.js** and **Passport.js** for the back-end. While on the other hand, we chose **Angular** for the front-end. Our project has to be built with **docker-compose**.

## Services and associated widgets description:
- **Google service**: This service allows the user to authenticate with his Google account. Therefore, the user will be able to see different YouTube statistics, depending on the widget: 
    - Youtube channel watcher: Use this widget to display stats of a given Youtube channel.
    - Youtube video watcher: Use this widget to display stats of a given Youtube video.
- **Microsoft service**: This service allows the user to authenticate with his Microsoft account. Therefore, depending on the widget, the user will be able to see some data linked to his account:
    - Microsoft mail center: Easily catch up with your unread emails!
    - Microsoft calendar resume: View your daily calendars events!
- **Twitch service**: This service allows the user to authenticate with his Twitch account. Therefore, depending on the widget, the user will be able to see some Twitch statistics:
    - Twitch user watcher: Use this widget to display stats of a given Twitch user.
    - Twitch stream watcher: Use this widget to display stats of a given Twitch online streamer.
- **Spotify service**: This service allows the user to authenticate with his Spotify account. Therefore, the user will be able to see some Spotify statistics about a given artist:
    - Spotify artist statistics: Monitor stats of a given spotify artist.
- **Reddit service**: This service allows the user to authenticate with his Reddit account. Therefore, the user will be able to see some Reddit statistics about a given subreddit:
    - Reddit subreddit watcher: Use this widget to display stats of a given Reddit subreddit.
- **Weather service**: This service allows to fetch some weather data.
    - Weather viewer: Use this widget to display the weather of a given city.

## How to run the app ?
First, you must fill out the necessary informations such as the CLIENT_ID, the SECRET_KEY, the authority etc for each service inside the server / client code.  
After that, make sure Docker and docker-compose command are installed.  
Finally, simply run the following command at the root of the repository:  
```sh
$> docker-compose up --build -d
```
The application will be available on ``localhost:80``.
