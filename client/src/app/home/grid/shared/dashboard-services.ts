import { faSun, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faMicrosoft, faReddit, faSpotify, faTwitch } from '@fortawesome/free-brands-svg-icons';
import { WidgetProps } from '../widgets/dashboard-widgets';

export interface DashboardServiceProps {
    icon: IconDefinition;
    name: string;
    widgets: WidgetProps[];
}

export const dashboardServices: DashboardServiceProps[] = [
    {
        icon: faGoogle,
        name: 'Google service',
        widgets: [
            {
                id: 'ytChannelWatcher',
                name: 'Youtube channel watcher',
                desc: 'Displays stats of a given Youtube channel.',
                cols: 4,
                rows: 3
            },
            {
                id: 'ytVideoWatcher',
                name: 'Youtube video watcher',
                desc: 'Displays stats of a given Youtube video.',
                cols: 5,
                rows: 4
            }
        ]
    },
    {
        icon: faMicrosoft,
        name: 'Microsoft service',
        widgets: [
            {
                id: 'msCalendar',
                name: 'Microsoft calendar resume',
                desc: 'Shows your calendar events',
                cols: 3,
                rows: 5
            },
            {
                id: 'msMail',
                name: 'Microsoft mail center',
                desc: 'Easily catch up with your unread emails!',
                cols: 4,
                rows: 5
            }
        ]
    },
    {
        icon: faTwitch,
        name: 'Twitch service',
        widgets: [
            {
                id: 'ttvUserWatcher',
                name: 'Twitch user watcher',
                desc: 'Use this widget to display stats of a given Twitch user.',
                cols: 4,
                rows: 3
            },
            {
                id: 'ttvStreamWatcher',
                name: 'Twitch stream watcher',
                desc: 'Use this widget to display stats of a given Twitch online streamer.',
                cols: 4,
                rows: 3
            }
        ]
    },
    {
        icon: faReddit,
        name: 'Reddit service',
        widgets: [
            {
                id: 'rdSubredditWatcher',
                name: 'Reddit subreddit watcher',
                desc: 'Use this widget to display stats of a given Reddit subreddit',
                cols: 4,
                rows: 3
            }
        ]
    },
    {
        icon: faSun,
        name: 'Weather service',
        widgets: [
            {
                id: 'weather',
                name: 'Weather viewer',
                desc: 'Use this widget to display a city current weather',
                cols: 3,
                rows: 4
            }
        ]
    },
    {
        icon: faSpotify,
        name: 'Spotify service',
        widgets: [
            {
                id: 'spotifyArtist',
                name: 'Spotify artist statistics',
                desc: 'Monitor stats of a given spotify artist.',
                cols: 4,
                rows: 2
            }
        ]
    }
];
