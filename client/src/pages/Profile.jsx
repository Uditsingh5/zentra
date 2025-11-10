import React, { useState } from "react";
import PostCard from "../components/Post/PostCard.jsx"; // import your existing PostCard
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, Location01Icon, Calendar01Icon, Link01Icon } from "@hugeicons/core-free-icons";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const profile = {
    name: "Udit Singh",
    username: "@uditcodes",
    bio: "Full Stack Developer ⚡ | Building Zentra 💻 | Passionate about clean design & scalable systems 🚀",
    location: "Bengaluru, India",
    joined: "March 2023",
    website: "zentra.in",
    followers: 1280,
    following: 256,
    postsCount: 42,
    avatar: "https://i.pravatar.cc/100?img=56",
    tags: ["#ReactJS", "#FullStack", "#OpenSource", "#DevLife"],
  };

  const about = {
    summary: [
      "💻 Full-stack developer passionate about AI/ML",
      "🎓 Currently working on Zentra project",
      "🚀 Love building products that make a difference",
      "📚 Always learning something new!",
    ],
    longBio: [
      "Full-stack developer with experience in building scalable web apps and interactive UIs.",
      "Passionate about solving real-world problems using modern web technologies.",
    ],
    experience: [
      "🏢 Full Stack Developer at Zentra",
      "💻 Open Source Contributor",
    ],
  };

  const skills = {
    languages: ["JavaScript", "Python", "TypeScript", "C++"],
    frameworks: ["React", "Node.js", "Express", "Next.js"],
    tools: ["Git", "Docker", "AWS", "PostgreSQL"],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 ">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-10 mb-6 shadow-sm">
          <div className="flex gap-6 mb-6 flex-col md:flex-row items-center md:items-start">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="mb-1 flex flex-col md:flex-row items-center md:justify-between gap-3">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{profile.name}</span>
                  <p className="text-gray-500">{profile.username}</p>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0 justify-center md:justify-end">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${
                      isFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-purple-400 text-white hover:bg-purple-500"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  {/* <button className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-300 transition-colors">
                    Message
                  </button> */}
                  <button className="hidden md:flex px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium items-center gap-2">
                    <HugeiconsIcon icon={Settings01Icon} size={18} /> Edit
                  </button>
                </div>
              </div>

              {/* Location / Joined / Website */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-gray-600 text-sm">
                <span className="flex items-center gap-1"><HugeiconsIcon icon={Location01Icon} size={16} /> {profile.location}</span>
                <span className="flex items-center gap-1"><HugeiconsIcon icon={Calendar01Icon} size={16} /> Joined {profile.joined}</span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Link01Icon} size={16} />
                  <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="text-purple-500 hover:underline">{profile.website}</a>
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 mt-5 text-gray-800">
                <span><strong>{profile.postsCount}</strong> Posts</span>
                <span><strong>{profile.followers}</strong> Followers</span>
                <span><strong>{profile.following}</strong> Following</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {profile.tags.map((tag, i) => (
                  <span key={i} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["posts", "about", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
                  activeTab === tab ? "text-purple-400" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "posts" && "📝 Posts"}
                {tab === "about" && "👤 About"}
                {tab === "skills" && "⚡ Skills"}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {/* Use your imported PostCard here multiple times */}
                <PostCard />
                <PostCard />
              </div>
            )}

            {activeTab === "about" && (
              <div className="text-gray-700 space-y-4">
                <h3 className="text-xl font-bold mb-4 text-gray-900">About {profile.name.split(" ")[0]}</h3>
                {about.longBio.map((para, i) => <p key={i} className="leading-relaxed">{para}</p>)}
                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-gray-900">Experience</h4>
                  <ul className="space-y-2 text-gray-600 list-none">{about.experience.map((exp, i) => <li key={i}>{exp}</li>)}</ul>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Technical Skills</h3>
                <SkillSection title="Languages" items={skills.languages} color="blue" />
                <SkillSection title="Frameworks & Libraries" items={skills.frameworks} color="purple" />
                <SkillSection title="Tools & Technologies" items={skills.tools} color="green" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillSection({ title, items, color }) {
  const colorClasses = { blue: "bg-blue-50 text-blue-700", purple: "bg-purple-50 text-purple-700", green: "bg-green-50 text-green-700" };
  return (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => <span key={i} className={`px-4 py-2 rounded-lg text-sm font-medium ${colorClasses[color]}`}>{item}</span>)}
      </div>
    </div>
  );
}
