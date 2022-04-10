import Vue from "vue";
import VueRouter from "vue-router";
import msgEditor from "../views/MsgEditor.vue";
import Browser from "../views/Browser.vue";
import newYearReset from "../views/NewYearReset.vue";
import rideReview from "../views/RideReview.vue";
import RideStatus from "../views/RideStatus.vue";
import RideLeaders from "../views/RideLeaders.vue";
import Login from "../components/Login.vue";
import List from "../views/List.vue";
import About from "../views/About.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/Login/:dialog/",
    name: "Login",
    props: true,
    component: Login,
  },
  {
    path: "/NewYearReset",
    name: "newYearReset",
    props: false,
    component: newYearReset,
  },
  {
    path: "/RideReview/:rideLeader/:rideStatus/",
    name: "rideReview",
    props: true,
    component: rideReview,
  },
  {
    path: "/RideLeaders",
    name: "RideLeaders",
    props: false,
    component: RideLeaders,
  },
  {
    path: "/",
    name: "RideStatus",
    props: false,
    component: RideStatus,
  },
  {
    path: "/Browser",
    props: false,
    name: "Browser",
    component: Browser,
  },

  {
    path: "/List",
    name: "List",
    props: false,
    component: List,
  },
  {
    path: "/About",
    name: "About",
    props: false,
    component: About,
  },
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //    component: () =>
  //      import(/* webpackChunkName: "about" */ "../views///List.vue"),

  {
    path: "/msgEditor/:filename/:title/",
    name: "msgEditor",
    props: true,
    component: msgEditor,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
