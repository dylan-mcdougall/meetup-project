const LOAD_GROUPS = 'groups/LOAD_GROUPS';
const RECEIVE_GROUP = 'groups/RECEIVE_GROUP';
const UPDATE_GROUP = 'groups/UPDATE_GROUP';
const REMOVE_GROUP = 'groups/REMOVE_GROUP';

export const loadGroups = (groups) => ({
    type: LOAD_GROUPS,
    groups,
});

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



const groupsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_GROUPS:
            const groupsState = {};
            action.groups.Groups.forEach((group) => {
                groupsState[group.id] = group;
            });
            return groupsState
        default:
            return state;
    }
}

export default groupsReducer;
