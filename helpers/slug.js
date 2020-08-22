import slugify from 'slugify';

export default function slug(name) {
    //lo que hace el replace es cambiar todo lo que no sea esos signos por nada ' '
    return slugify(name, {lower:true}).replace(/[^\w\-]+/g,'');
}