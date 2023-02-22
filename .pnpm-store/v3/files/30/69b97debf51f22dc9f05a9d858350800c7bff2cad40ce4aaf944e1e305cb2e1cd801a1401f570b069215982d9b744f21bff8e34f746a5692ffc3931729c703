/// <reference types="react" />
import { JsonLdProps } from './jsonld';
import { ArticleAuthor } from '../types';
export interface NewsArticleJsonLdProps extends JsonLdProps {
    url: string;
    title: string;
    images: ReadonlyArray<string>;
    section: string;
    keywords: string;
    dateCreated: string;
    datePublished: string;
    dateModified?: string;
    authorName: string | string[] | ArticleAuthor | ArticleAuthor[];
    description: string;
    body: string;
    publisherName: string;
    publisherLogo: string;
    isAccessibleForFree?: boolean;
}
declare function NewsArticleJsonLd({ type, keyOverride, url, title, images, section, dateCreated, datePublished, dateModified, authorName, authorType, publisherName, publisherLogo, body, isAccessibleForFree, ...rest }: NewsArticleJsonLdProps): JSX.Element;
export default NewsArticleJsonLd;
