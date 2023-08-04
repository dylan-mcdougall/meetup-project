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

    const updatedGroupsArray = await Promise.all(groups.Groups.map(async (group) => {
        const res = await fetch(`/api/groups/${group.id}/events`);
        group.Events = await res.json();
        return group;
    }));

    const updatedGroupsObject = {
        Groups: []
    };

    updatedGroupsArray.forEach((group) => {
        updatedGroupsObject.Groups[group.id] = group;
    });

    dispatch(loadGroups(updatedGroupsObject));
}

export const fetchGroupDetails = (groupId) => async (dispatch) => {
    const res = await fetch(`/api/groups/${groupId}`);
    const events = await fetch(`/api/groups/${groupId}/events`);
    if (res.ok) {
        const groupDetails = await res.json();
        const eventDetails = await events.json();

        groupDetails.Events = eventDetails;
        dispatch(receiveGroup(groupDetails));
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
        case RECEIVE_GROUP:
            if (action.group) {
                const newState = { ...state };
                newState[action.group.id] = action.group
                return newState;
            } else {
                return state;
            }
        default:
            return state;
    }
}

export default groupsReducer;
