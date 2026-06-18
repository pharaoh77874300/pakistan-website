import { PageLoader } from "@/components/shared/LoadingSpinner";
import AdminPage from "@/pages/AdminPage";
import JoinModeratorPage from "@/pages/JoinModeratorPage";
import SettingsPage from "@/pages/SettingsPage";
import { useAuthStore } from "@/store/auth-store";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const ExplorePage = lazy(() => import("@/pages/ExplorePage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const EditProfilePage = lazy(() => import("@/pages/EditProfilePage"));
const PostDetailPage = lazy(() => import("@/pages/PostDetailPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const ProfileSetupPage = lazy(() => import("@/pages/ProfileSetupPage"));

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
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    // Authenticated users without a profile must complete setup first
    if (user && !user.profile) {
      throw redirect({ to: "/profile/setup" });
    }
  },
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

const profileSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/setup",
  component: ProfileSetupPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  // Admin panel handles its own II auth gate — no profile required.
  // Unauthenticated users see a "Continue with Internet Identity" screen.
  component: AdminPage,
});

const joinModeratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/join-moderator",
  validateSearch: (search: Record<string, unknown>) => ({
    code: search.code as string | undefined,
  }),
  component: JoinModeratorPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  exploreRoute,
  editProfileRoute,
  profileSetupRoute,
  profileRoute,
  postDetailRoute,
  settingsRoute,
  notificationsRoute,
  joinModeratorRoute,
  adminRoute,
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
