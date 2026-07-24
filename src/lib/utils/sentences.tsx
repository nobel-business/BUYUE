import { Fragment, type ReactNode } from 'react';

/**
 * SENTENCE-PER-LINE — approved copy renders one sentence per line.
 *
 * A sentence break is a "." that is BOTH not part of an ellipsis AND followed by
 * whitespace + more text. Everything else is left alone on purpose:
 *
 *   "نبيع كــل شي... إلا الكلام."   → "..." is an ellipsis, never splits
 *   "info@buyue.agency"              → no whitespace after the dot, never splits
 *   "…فريقنا أكثر؟ تواصل معنا"       → only the PERIOD was asked for; ؟ and ! stay
 *   "3347 طريق الظهران"              → no period at all
 *
 * Implemented as a hand-rolled scan rather than a regex with lookbehind: Safari
 * below 16.4 throws a SyntaxError on lookbehind at PARSE time, which would take
 * down the whole bundle rather than just this feature.
 */

/** True when `token` is the last word of a sentence (ends in a non-ellipsis period). */
export function endsSentence(token: string): boolean {
  return /[^.]\.$/.test(token);
}

/** Split `text` into sentences. Returns a single-element array when it has none. */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] !== '.') continue;
    // Part of an ellipsis (".." or "...") — not a sentence end.
    if (text[i - 1] === '.' || text[i + 1] === '.') continue;

    // Require whitespace, then something after it — otherwise this is the final
    // period of the string, or a dot inside a token like a domain name.
    // charAt (not [j]) — under `noUncheckedIndexedAccess` indexing yields
    // `string | undefined`; charAt always returns a string.
    let j = i + 1;
    while (j < text.length && /\s/.test(text.charAt(j))) j += 1;
    if (j === i + 1 || j >= text.length) continue;

    out.push(text.slice(start, i + 1).trim());
    start = j;
  }

  const tail = text.slice(start).trim();
  if (tail) out.push(tail);
  return out.length > 1 ? out : [text];
}

/**
 * Render `children` with a <br> after every sentence-ending period.
 *
 * Non-string children pass through untouched, so this is safe to drop into a
 * shared primitive like <Text> that also receives elements. <br> (rather than a
 * block-level wrapper) keeps the paragraph a single semantic unit, inherits
 * text-align/direction, and cannot disturb RTL bidi resolution.
 */
export function withSentenceBreaks(children: ReactNode): ReactNode {
  if (typeof children !== 'string') return children;

  const sentences = splitSentences(children);
  if (sentences.length < 2) return children;

  return sentences.map((sentence, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {sentence}
    </Fragment>
  ));
}
