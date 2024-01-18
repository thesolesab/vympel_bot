export function saveToSession(ctx, field, data) {
    ctx.session[field] = data;
}

export function deleteFromSession(ctx, field) {
    if (Array.isArray(field)) {
        field.forEach(el => deleteFromSession(ctx, el))
    } else {
        delete ctx.session[field];
    }
}