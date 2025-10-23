import Link from 'next/link';

type Props = {
    params: {
        assembly: string;
    };
};

export default function Page({ params }: Props) {
    const { assembly } = params;
    const renderedAt = new Date().toLocaleString();

    return (
        <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial' }}>
            <h1>Sample Assembly Page</h1>
            <p>
                <strong>assembly:</strong> {assembly}
            </p>
            <p>
                <strong>Rendered at:</strong> {renderedAt}
            </p>
            <p>This is a minimal example of a dynamic route page using Next.js App Router.</p>
            <p>
                <Link href="/">← Back to home</Link>
            </p>
        </main>
    );
}