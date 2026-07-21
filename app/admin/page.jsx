"use client";

import { useEffect, useMemo, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, db, storage } from "@/lib/firebase";

const ADMIN_EMAIL = "arclub99@gmail.com";
const COLLECTION_NAME = "portfolio";

const categoryOptions = [
  "Elementor",
  "WPBakery",
  "DIVI",
  "Custom",
];

const initialForm = {
  title: "",
  link: "",
  category: "Elementor",
  order: 0,
  thumb: "",
  hoverImg: "",
  thumbPath: "",
  hoverPath: "",
};

export default function AdminPage() {
  const provider = useMemo(() => new GoogleAuthProvider(), []);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [thumbFile, setThumbFile] = useState(null);
  const [hoverFile, setHoverFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Check login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load portfolio projects
  useEffect(() => {
    if (!isAdmin) {
      setProjects([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),

      (snapshot) => {
        const projectData = snapshot.docs
          .map((projectDocument) => ({
            id: projectDocument.id,
            ...projectDocument.data(),
          }))
          .sort(
            (first, second) =>
              Number(first.order || 0) -
              Number(second.order || 0)
          );

        setProjects(projectData);
      },

      (error) => {
        setMessage(`Project load failed: ${error.message}`);
      }
    );

    return unsubscribe;
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      setMessage("Signing in...");
      await signInWithPopup(auth, provider);
      setMessage("");
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMessage("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const validateImage = (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image must be smaller than 10 MB");
    }
  };

  const uploadImage = async (file, folderName) => {
    validateImage(file);

    const safeFileName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    );

    const storagePath =
      `portfolio/${folderName}/${Date.now()}-${safeFileName}`;

    const storageReference = ref(storage, storagePath);

    await uploadBytes(storageReference, file, {
      contentType: file.type,
    });

    const imageUrl = await getDownloadURL(storageReference);

    return {
      url: imageUrl,
      path: storagePath,
    };
  };

  const removeStorageFile = async (storagePath) => {
    if (!storagePath) return;

    try {
      await deleteObject(ref(storage, storagePath));
    } catch (error) {
      if (error?.code !== "storage/object-not-found") {
        throw error;
      }
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setThumbFile(null);
    setHoverFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      setMessage("You are not authorized.");
      return;
    }

    try {
      setSaving(true);
      setMessage("Saving project...");

      let newThumbnail = {
        url: form.thumb,
        path: form.thumbPath,
      };

      let newHoverImage = {
        url: form.hoverImg,
        path: form.hoverPath,
      };

      if (thumbFile) {
        setMessage("Uploading thumbnail...");

        newThumbnail = await uploadImage(
          thumbFile,
          "thumbs"
        );
      }

      if (hoverFile) {
        setMessage("Uploading hover image...");

        newHoverImage = await uploadImage(
          hoverFile,
          "mockups"
        );
      }

      const projectData = {
        title: form.title.trim(),
        link: form.link.trim(),
        category: form.category,
        order: Number(form.order) || 0,

        thumb: newThumbnail.url || "",
        hoverImg: newHoverImage.url || "",

        thumbPath: newThumbnail.path || "",
        hoverPath: newHoverImage.path || "",

        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(
          doc(db, COLLECTION_NAME, editingId),
          projectData
        );
      } else {
        await addDoc(collection(db, COLLECTION_NAME), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
      }

      // Remove old images after successful update
      if (
        thumbFile &&
        form.thumbPath &&
        form.thumbPath !== newThumbnail.path
      ) {
        await removeStorageFile(form.thumbPath);
      }

      if (
        hoverFile &&
        form.hoverPath &&
        form.hoverPath !== newHoverImage.path
      ) {
        await removeStorageFile(form.hoverPath);
      }

      setMessage(
        editingId
          ? "Project updated successfully."
          : "Project added successfully."
      );

      resetForm();
    } catch (error) {
      setMessage(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      link: project.link || "",
      category: project.category || "Elementor",
      order: project.order ?? 0,
      thumb: project.thumb || "",
      hoverImg: project.hoverImg || "",
      thumbPath: project.thumbPath || "",
      hoverPath: project.hoverPath || "",
    });

    setThumbFile(null);
    setHoverFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (project) => {
    if (!isAdmin) return;

    const confirmation = window.confirm(
      `Delete "${project.title}"?`
    );

    if (!confirmation) return;

    try {
      setMessage("Deleting project...");

      await deleteDoc(
        doc(db, COLLECTION_NAME, project.id)
      );

      await Promise.allSettled([
        removeStorageFile(project.thumbPath),
        removeStorageFile(project.hoverPath),
      ]);

      if (editingId === project.id) {
        resetForm();
      }

      setMessage("Project deleted successfully.");
    } catch (error) {
      setMessage(`Delete failed: ${error.message}`);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#111115] p-8 text-white">
        Checking login...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#111115] p-5 text-white">
        <section className="w-full max-w-md rounded-2xl border border-[#33333b] bg-[#1a1a1e] p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold">
            Admin Login
          </h1>

          <p className="mb-6 text-[#aaaab2]">
            Authorized Google account দিয়ে login করুন।
          </p>

          <button
            type="button"
            onClick={handleLogin}
            className="cursor-pointer rounded-lg bg-[#f5c518] px-5 py-3 font-bold text-[#111115]"
          >
            Sign in with Google
          </button>

          {message && (
            <p className="mt-5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-400">
              {message}
            </p>
          )}
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#111115] p-5 text-white">
        <section className="w-full max-w-md rounded-2xl border border-[#33333b] bg-[#1a1a1e] p-8 text-center">
          <h1 className="mb-3 text-3xl font-bold">
            Access Denied
          </h1>

          <p className="mb-6 text-[#aaaab2]">
            {user.email} admin account নয়।
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg bg-[#3a3a42] px-5 py-3 font-bold"
          >
            Sign Out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111115] p-5 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Portfolio Admin
            </h1>

            <p className="mt-1 text-[#aaaab2]">
              Logged in as {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer rounded-lg bg-[#3a3a42] px-5 py-3 font-bold"
          >
            Sign Out
          </button>
        </header>

        {message && (
          <p className="mb-5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-400">
            {message}
          </p>
        )}

        <section className="mb-8 rounded-2xl border border-[#33333b] bg-[#1a1a1e] p-6">
          <h2 className="text-2xl font-bold">
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block font-semibold">
                Project Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#3b3b44] bg-[#111115] p-3 outline-none focus:border-[#f5c518]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#3b3b44] bg-[#111115] p-3 outline-none focus:border-[#f5c518]"
              >
                {categoryOptions.map((category) => (
                  <option key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">
                Live Website Link
              </label>

              <input
                name="link"
                type="url"
                value={form.link}
                onChange={handleChange}
                required
                placeholder="https://example.com"
                className="w-full rounded-lg border border-[#3b3b44] bg-[#111115] p-3 outline-none focus:border-[#f5c518]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Display Order
              </label>

              <input
                name="order"
                type="number"
                value={form.order}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#3b3b44] bg-[#111115] p-3 outline-none focus:border-[#f5c518]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Thumbnail Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setThumbFile(
                    event.target.files?.[0] || null
                  )
                }
                className="w-full rounded-lg border border-[#3b3b44] bg-[#111115] p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">
                Hover/Long Screenshot
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setHoverFile(
                    event.target.files?.[0] || null
                  )
                }
                className="w-full rounded-lg border border-[#3b3b44] bg-[#111115] p-3"
              />
            </div>

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer rounded-lg bg-[#f5c518] px-5 py-3 font-bold text-[#111115] disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Project"
                    : "Add Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="cursor-pointer rounded-lg bg-[#3a3a42] px-5 py-3 font-bold"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <h2 className="mb-5 text-2xl font-bold">
          Existing Projects ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#44444c] p-8 text-center text-[#aaaab2]">
            No projects found.
          </p>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-[#33333b] bg-[#1a1a1e]"
              >
                {project.thumb ? (
                  <img
                    src={project.thumb}
                    alt={project.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[16/10] place-items-center bg-[#25252b] text-[#777780]">
                    No Image
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    {project.title}
                  </h3>

                  <p className="my-3 text-sm text-[#aaaab2]">
                    {project.category} · Order{" "}
                    {project.order ?? 0}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="cursor-pointer rounded-lg bg-[#f5c518] px-4 py-2 font-bold text-[#111115]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}