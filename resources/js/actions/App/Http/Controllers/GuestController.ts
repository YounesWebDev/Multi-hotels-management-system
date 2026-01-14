import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/guests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GuestController::index
 * @see app/Http/Controllers/GuestController.php:12
 * @route '/guests'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\GuestController::store
 * @see app/Http/Controllers/GuestController.php:23
 * @route '/guests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/guests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GuestController::store
 * @see app/Http/Controllers/GuestController.php:23
 * @route '/guests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GuestController::store
 * @see app/Http/Controllers/GuestController.php:23
 * @route '/guests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GuestController::store
 * @see app/Http/Controllers/GuestController.php:23
 * @route '/guests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GuestController::store
 * @see app/Http/Controllers/GuestController.php:23
 * @route '/guests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
export const show = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/guests/{guest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
show.url = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: args.guest,
                }

    return show.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
show.get = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
show.head = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
    const showForm = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
        showForm.get = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GuestController::show
 * @see app/Http/Controllers/GuestController.php:38
 * @route '/guests/{guest}'
 */
        showForm.head = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
export const update = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/guests/{guest}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
update.url = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: args.guest,
                }

    return update.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
update.put = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
update.patch = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
    const updateForm = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
        updateForm.put = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\GuestController::update
 * @see app/Http/Controllers/GuestController.php:43
 * @route '/guests/{guest}'
 */
        updateForm.patch = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\GuestController::destroy
 * @see app/Http/Controllers/GuestController.php:56
 * @route '/guests/{guest}'
 */
export const destroy = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/guests/{guest}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\GuestController::destroy
 * @see app/Http/Controllers/GuestController.php:56
 * @route '/guests/{guest}'
 */
destroy.url = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { guest: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    guest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        guest: args.guest,
                }

    return destroy.definition.url
            .replace('{guest}', parsedArgs.guest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GuestController::destroy
 * @see app/Http/Controllers/GuestController.php:56
 * @route '/guests/{guest}'
 */
destroy.delete = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\GuestController::destroy
 * @see app/Http/Controllers/GuestController.php:56
 * @route '/guests/{guest}'
 */
    const destroyForm = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GuestController::destroy
 * @see app/Http/Controllers/GuestController.php:56
 * @route '/guests/{guest}'
 */
        destroyForm.delete = (args: { guest: string | number } | [guest: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const GuestController = { index, store, show, update, destroy }

export default GuestController