const LOAD_EVENTS = 'events/LOAD_EVENTS';
const RECEIVE_EVENT = 'events/RECEIVE_GROUP';
const UPDATE_EVENT = 'events/UPDATE_EVENT';
const REMOVE_EVENT = 'events/REMOVE_EVENT';

export const loadEvents = (events) => ({
    type: LOAD_EVENTS,
    events,
});

export const receiveEvent = (event) => ({
    type: RECEIVE_EVENT,
    event,
});

export const updateEvent = (event) => ({
    type: UPDATE_EVENT,
    event,
});

export const removeEvent = (eventId) => ({
    type: REMOVE_EVENT,
    eventId,
});

export const fetchEvents = () => async (dispatch) => {
    const res = await fetch('/api/events');
    const events = await res.json();
    const updatedEventsArray = await Promise.all(events.Events.map(async (event) => {
        const res = await fetch(`/api/events/${event.id}`);
        return await res.json();
    }));

    const updatedEventsObject = {
        Events: []
    };
    updatedEventsArray.forEach((event) => {
        updatedEventsObject.Events[event.id] = event;
    });

    console.log(updatedEventsObject);
    dispatch(loadEvents(updatedEventsObject));
}

const eventsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_EVENTS:
            const eventsState = {};
            action.events.Events.forEach((event) => {
                eventsState[event.id] = event;
            });
            return eventsState
        default:
            return state;
    }
}

export default eventsReducer;
