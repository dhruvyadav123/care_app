import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';
import authReducer from '../../features/auth/authSlice';
import { userReducer } from '../stateSlice/userReducer';
// import { categoryReducer } from '../stateSlice/socialmeetCategoryReducer';
import { servicesReducer } from '../stateSlice/servicesReducer';
import { serviceCategoryReducer } from '../stateSlice/serviceCategoryReducer';
import { vendorReducer } from '../stateSlice/vendorReducer';
import { dietChartReducer } from '../stateSlice/dietChartReducer';
import allUsers from '../stateSlice/allUsers';
import allGamesReducer from '../stateSlice/gamesReducer';
import { fitnessBannerReducer } from '../stateSlice/allFitnessBanners';
import allcommunityCategory from '../stateSlice/allcommunityCategory';
import { homeBannerReducer } from '../stateSlice/allHomeBanners';
import fitnessCategoryReducer from "../stateSlice/allFitnessCategory"; 
import videoCategoryReducer from "../stateSlice/allVideoCategory";
import eventReducer from "../stateSlice/eventListReducer";
import donateReducer from "../stateSlice/doneListReducer";
import classReducer from "../stateSlice/classReducer";
import fitnessVideoReducer from "../stateSlice/videoReducer";
import socialMeetCategoriesReducer from "../stateSlice/socialmeetCategoryReducer";
import { roleReducer } from '../stateSlice/roleReducer';
import { subAdminReducer } from '../stateSlice/subAdmin';
import { medicineReducer } from '../stateSlice/medicine';
import { doctorReducer } from '../stateSlice/doctor';
import { fitnessCategoriesReducer } from '../stateSlice/fitnessCategory';
import { vacinationReducer } from '../stateSlice/vacination';
import { communityReducer } from '../stateSlice/community';
import storyReducer from '../stateSlice/storyReducer';
import badgeReducer from '../stateSlice/badgeReducer';
import alzheimerGamesReducer from '../stateSlice/alzheimerGamesReducer';
import { expertReducer } from '../stateSlice/expertReducer';
import { expertEventReducer } from '../stateSlice/expertEventReducer';
import { productReducer } from '../stateSlice/productReducer';
import { orderStatusReducer } from '../stateSlice/orderStatusReducer';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  userState:userReducer,
  // socialmeetCategory: categoryReducer,
  serviceCategories: serviceCategoryReducer,
  services: servicesReducer,
  vendors: vendorReducer,
  dietCharts: dietChartReducer,
  allUsers,
  allGames: allGamesReducer,
  allbanners: fitnessBannerReducer,
  homeBanners: homeBannerReducer,
  fitnessCategory: fitnessCategoryReducer,
  communityCategoreis: allcommunityCategory,
  videoCategory: videoCategoryReducer,
  events: eventReducer,
  donations: donateReducer,
  class: classReducer,
  fitnessVideos: fitnessVideoReducer,
  socialMeetCategories: socialMeetCategoriesReducer,
  roles:roleReducer,
  users:subAdminReducer,
  medicine:medicineReducer,
  doctor:doctorReducer,
  category:fitnessCategoriesReducer,
  vacination:vacinationReducer,
  community:communityReducer,
  stories:storyReducer,
  badges:badgeReducer,
  alzheimerGames: alzheimerGamesReducer,
  experts: expertReducer,
  expertEvents: expertEventReducer,
  products: productReducer,
  orderStatuses: orderStatusReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
