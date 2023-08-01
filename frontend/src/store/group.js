const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const RECEIVE_GROUP = 'groups/RECEIVE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const REMOVE_GROUP = 'groups/REMOVE_GROUP';
const LOAD_GROUP_EVENTS = 'groups/LOAD_GROUP_EVENTS';

export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups,
});

export const loadGroupEvents = (groupId, events) => ({
    type: LOAD_GROUP_EVENTS,
    groupId,
    events,
})

export const receiveGroup = (group) => ({
    type: RECEIVE_GROUP,
    group,
});

export const updateGroup = (group) => ({
    type: UPDATE_GROUP,
    group,
});

export const removeGroup = (groupId) => ({
    type: REMOVE_GROUP,
    groupId,
});



export const fetchGroups = () => async (dispatch) => {
    const res = await fetch('/api/groups');
    const groups = await res.json();
    dispatch(loadGroups(groups));
}

export const fetchGroupEvents = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}/events`);
    if (res.ok) {
        const events = await res.json();
        dispatch(loadGroupEvents(groupId, events));
    } else {
        const errors = await res.json();
        return errors;
    }
}

export const fetchGroupDetails = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}`);
    if (res.ok) {
        const details = await res.json();
        dispatch(receiveGroup(details));
    } else {
        const errors = await res.json();
        return errors;
    }
}


const groupsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_GROUPS:
            const groupsState = {};
            action.groups.Groups.forEach((group) => {
                groupsState[group.id] = group;
            });
            return groupsState;
        case LOAD_GROUP_EVENTS:
            const newState = { ...state };
            newState[action.groupId].Events = action.events
            return newState;
        case RECEIVE_GROUP:
            if (action.group) {
                return { ...state, [action.group.id]: action.group }
            } else {
                return state;
            }
        default:
            return state;
    }
}

export default groupsReducer;
