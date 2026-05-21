import { PageLoader } from "@/components/shared/LoadingSpinner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ExplorePage = lazy(() => import("@/pages/ExplorePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const EditProfilePage = lazy(() => import("@/pages/EditProfilePage"));
const PostDetailPage = lazy(() => import("@/pages/PostDetailPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const OnboardingWelcomePage = lazy(
  () => import("@/pages/OnboardingWelcomePage"),
);
const OnboardingProfilePage = lazy(
  () => import("@/pages/OnboardingProfilePage"),
);
const OnboardingFollowPage = lazy(() => import("@/pages/OnboardingFollowPage"));

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/explore",
  validateSearch: (search: Record<string, unknown>) => ({
    q: search.q as string | undefined,
  }),
  component: ExplorePage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$userId",
  component: ProfilePage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/edit",
  component: EditProfilePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$postId",
  component: PostDetailPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const onboardingWelcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding/welcome",
  component: OnboardingWelcomePage,
});

const onboardingProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding/profile",
  component: OnboardingProfilePage,
});

const onboardingFollowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding/follow",
  component: OnboardingFollowPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  exploreRoute,
  editProfileRoute,
  profileRoute,
  postDetailRoute,
  onboardingWelcomeRoute,
  onboardingProfileRoute,
  onboardingFollowRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
