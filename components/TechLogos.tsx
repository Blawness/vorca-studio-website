// Minimal monochrome-friendly brand marks for the tech stack section.
// Kept as inline SVG so they stay crisp at any size and inherit sizing classes.

type IconProps = { className?: string };

export function NextjsLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" aria-hidden>
      <circle cx="64" cy="64" r="64" fill="#fff" />
      <path
        d="M106.3 112.1 49.2 38.7H38.7v50.5h8.4V49.4l52.5 67.8a64.2 64.2 0 0 0 6.7-5.1Z"
        fill="#000"
      />
      <path d="M81.4 38.7h8.3v50.5h-8.3z" fill="#000" />
    </svg>
  );
}

export function TypeScriptLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden>
      <rect width="128" height="128" rx="14" fill="#3178C6" />
      <path
        fill="#fff"
        d="M68.7 67.4v-9.2h-34v9.2h11.4v32.7h11.2V67.4h11.4Zm4.6 30.7c1.8 1 4 1.7 6.5 2.2 2.5.5 5.1.8 7.9.8 2.7 0 5.2-.3 7.6-.8 2.4-.5 4.5-1.4 6.3-2.6 1.8-1.2 3.2-2.7 4.3-4.6 1-1.9 1.6-4.3 1.6-7.1 0-2-.3-3.8-1-5.3a12 12 0 0 0-2.7-4c-1.2-1.2-2.6-2.2-4.3-3.1a47 47 0 0 0-5.7-2.5c-1.5-.6-2.8-1.1-4-1.7-1.1-.5-2.1-1-2.9-1.6-.8-.5-1.4-1.1-1.8-1.7-.4-.6-.6-1.3-.6-2.1 0-.7.2-1.4.6-1.9.4-.6 1-1 1.7-1.5.7-.4 1.6-.7 2.7-.9 1-.2 2.2-.3 3.5-.3 1 0 2 .1 3 .2 1.1.2 2.2.4 3.3.7 1 .3 2 .7 3 1.1 1 .5 1.8 1 2.6 1.6v-10.4a30 30 0 0 0-5.3-1.4c-1.9-.3-4-.4-6.5-.4-2.7 0-5.2.3-7.6.9-2.4.6-4.5 1.5-6.2 2.7a13.6 13.6 0 0 0-4.3 4.7c-1 1.9-1.6 4.2-1.6 6.8 0 3.3 1 6.1 2.9 8.4 1.9 2.3 4.8 4.3 8.7 5.9 1.6.6 3 1.3 4.4 1.9 1.3.6 2.5 1.2 3.4 1.9 1 .6 1.7 1.3 2.3 2 .5.8.8 1.6.8 2.6 0 .7-.2 1.3-.5 1.9-.4.5-.9 1-1.6 1.4-.7.4-1.6.7-2.6.9-1.1.2-2.3.3-3.7.3-2.4 0-4.7-.4-7-1.3a21 21 0 0 1-6.5-3.8v11.2Z"
      />
    </svg>
  );
}

export function TailwindLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden>
      <path
        fill="#38BDF8"
        d="M64 25.6C46.9 25.6 36.3 34.1 32 51.2c6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.4 4.7 12.2 8.6C73 56.8 80.4 64 96 64c17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.6C87 32.8 79.6 25.6 64 25.6ZM32 64C14.9 64 4.3 72.5 0 89.6c6.4-8.5 13.9-11.7 22.4-9.6 4.9 1.2 8.4 4.7 12.2 8.6C41 95.2 48.4 102.4 64 102.4c17.1 0 27.7-8.5 32-25.6-6.4 8.5-13.9 11.7-22.4 9.6-4.9-1.2-8.3-4.7-12.2-8.6C55 71.2 47.6 64 32 64Z"
      />
    </svg>
  );
}

export function VercelLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden>
      <path fill="#fff" d="M64 16 120 112H8L64 16Z" />
    </svg>
  );
}

export function SupabaseLogo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden>
      <path
        fill="#3ECF8E"
        d="M73 117.6c-3.2 4-9.7 1.8-9.8-3.4L62 77.7h45.9c8.3 0 13 9.6 7.8 16.1L73 117.6Z"
      />
      <path
        fill="#3ECF8E"
        opacity=".7"
        d="M55 10.4c3.2-4 9.7-1.8 9.8 3.4L66 50.3H20.1c-8.3 0-13-9.6-7.8-16.1L55 10.4Z"
      />
    </svg>
  );
}
