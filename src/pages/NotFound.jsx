import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section pt-32">
      <div className="shell max-w-lg text-center">
        <p className="eyebrow">404</p>
        <h1 className="display mt-3 text-5xl">This page is not on the menu.</h1>
        <p className="mt-4 text-stone">The address may be mistyped. The café is still open on the homepage.</p>
        <Link to="/" className="btn btn-primary mt-6">Back to Mithaas</Link>
      </div>
    </section>
  );
}
