import { SectionHeading } from "@/components/layout/section-heading";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { requireUserPageSession } from "@/lib/auth-guards";
import { getCurrentUserProfile } from "@/services/user-service";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const session = await requireUserPageSession();
  const profile = await getCurrentUserProfile(session.user);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Edit Profile"
        title="Update your LexCircle profile"
        description="Keep your public writer profile current across your posts, comments, and community presence."
      />
      <EditProfileForm
        initialValues={{
          name: profile.name,
          bio: profile.bio,
          image: profile.image,
        }}
      />
    </div>
  );
}
