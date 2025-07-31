import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '@/api/axios'

const initialState = {
    comments: [],
    status: 'idle',
    error: null,
}

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async(blogId, {rejectWithValue}) => {
        try{
            console.log("Fetching comments for blogId:", blogId);
            const response = await axiosInstance.get(`/comments/${blogId}`);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const createComment = createAsyncThunk(
    'comments/createComment',
    async({blogId, comment, parent = null}, {rejectWithValue, getState}) => {
        try{
            const {token} = getState().auth;
            if(!token){
                return rejectWithValue({message: 'Auhtentication token not found. PLEASe login.'});
            }
            const config = {headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }}

            const response = await axiosInstance.post(`/comments/${blogId}`, {comment, parent});
            return response.data;
        } catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async({commentId, comment}, {rejectWithValue, getState}) => {
        try{
            const {token} = getState().auth;
            if(!token){
                return rejectWithValue({message: 'authentication token not found. please login,'});
            }

            const response = await axiosInstance.put(`/comments/${commentId}`, { comment });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async(commentId, {rejectWithValue, getState}) => {
        try{
            const { token } = getState().auth;
            if (!token) {
                return rejectWithValue({ message: 'Authentication token not found. Please log in.' });
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axiosInstance.delete(`/comments/${commentId}`);
            return commentId;
        } catch(error){
            return rejectWithValue(error.response.data);
        }
    }
)

const findAndUpdateComment = (comments, updatedComment) => {
    return comments.map(comment => {
        if(comment._id === updatedComment._id){
            return updatedComment;
        }

        if(comment.children && comment.children.length > 0){
            return {
                ...comment,
                children: findAndUpdateComment(comment.children , updatedComment)
            }
        }

        return comment;
    })
}

const findAndRemoveComment = (comments, commentId) => {
    return comments.filter(comment => {
        if(comment._id === commentId){
            return false;
        }

        if(comment.children && comment.children.length > 0){
            comment.children = findAndRemoveComment(comment.children, commentId);
        }
        return true;
    })
}

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        resetCommentStatus: (state) => {
            state.status='idle';
            state.error=null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status='loading';
            })
            .addCase(fetchComments.fulfilled, (state, action) =>{ 
                state.status = 'succeeded';
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                if(!action.payload.isReply){
                    state.comments.push(action.payload);
                } else{
                    const addReplyToParent = (commentsArr, newComment) => {
                        return commentsArr.map(comment =>{
                            if (comment._id === newComment.parent) {
                                return {
                                    ...comment,
                                    children: [...(comment.children || []), newComment]
                                };
                            }
                            if (comment.children && comment.children.length > 0) {
                                return {
                                    ...comment,
                                    children: addReplyToParent(comment.children, newComment)
                                };
                            }
                            return comment;
                        })
                    }
                    state.comments = addReplyToParent(state.comments, action.payload);
                }
            })
            .addCase(createComment.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateComment.fulfilled, (state, action) => {
                state.comments = findAndUpdateComment(state.comments, action.payload);
            })
            .addCase(updateComment.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = findAndRemoveComment(state.comments, action.payload);
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
})

export const {resetCommentStatus} = commentSlice.actions;
export default commentSlice.reducer;