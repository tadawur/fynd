export default function CheckEmailPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Skontroluj si e-mail</h1>
      <p className="max-w-sm text-zinc-400">
        Poslali sme ti potvrdzovací odkaz. Po kliknutí naň sa budeš môcť
        prihlásiť do Fynd appky.
      </p>
    </div>
  );
}
