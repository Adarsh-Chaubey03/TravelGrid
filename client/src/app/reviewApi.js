import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from '../config';

const Review_Api = config.API_BASE_URL.replace('/api', ''); //backened api

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Review_Api,
    credentials: "include",
  }),
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => "/api/reviews/",
      providesTags: ["Reviews"],
    }),
    addComment: builder.mutation({
      query: ({ comment, stars }) => ({
        url: '/api/reviews/add',
        method: "POST",
        body: { comment, stars },
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useAddCommentMutation,
  useGetReviewsQuery,
} = reviewApi;