import Link from "next/link";
import Image from "next/image";

export default function AccountInactivePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
        <Image
          src="/error.svg"
          alt="Account Inactive"
          width={80}
          height={80}
          className="mx-auto mb-6 h-20 w-20"
        />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Account Deactivated
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Your account has been deactivated by the administrator.
          <br />
          If you believe this is a mistake or need further assistance, please
          contact your school administrator.
        </p>
        <Link
          href="mailto:admin@soultouchacademy.com"
          className="hover:bg-brand-dark mt-4 inline-block rounded-lg bg-brand px-6 py-2 font-semibold text-white transition"
        >
          Contact Admin
        </Link>
      </div>
    </div>
  );
}
