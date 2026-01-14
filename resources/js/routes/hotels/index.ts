import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/hotels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\HotelController::index
 * @see app/Http/Controllers/HotelController.php:14
 * @route '/hotels'
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
* @see \App\Http\Controllers\HotelController::store
 * @see app/Http/Controllers/HotelController.php:28
 * @route '/hotels'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hotels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\HotelController::store
 * @see app/Http/Controllers/HotelController.php:28
 * @route '/hotels'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\HotelController::store
 * @see app/Http/Controllers/HotelController.php:28
 * @route '/hotels'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\HotelController::store
 * @see app/Http/Controllers/HotelController.php:28
 * @route '/hotels'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HotelController::store
 * @see app/Http/Controllers/HotelController.php:28
 * @route '/hotels'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
export const update = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/hotels/{hotel}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
update.url = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hotel: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hotel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hotel: args.hotel,
                }

    return update.definition.url
            .replace('{hotel}', parsedArgs.hotel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
update.put = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
update.patch = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
    const updateForm = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
        updateForm.put = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\HotelController::update
 * @see app/Http/Controllers/HotelController.php:47
 * @route '/hotels/{hotel}'
 */
        updateForm.patch = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\HotelController::destroy
 * @see app/Http/Controllers/HotelController.php:66
 * @route '/hotels/{hotel}'
 */
export const destroy = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/hotels/{hotel}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\HotelController::destroy
 * @see app/Http/Controllers/HotelController.php:66
 * @route '/hotels/{hotel}'
 */
destroy.url = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hotel: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hotel: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hotel: args.hotel,
                }

    return destroy.definition.url
            .replace('{hotel}', parsedArgs.hotel.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\HotelController::destroy
 * @see app/Http/Controllers/HotelController.php:66
 * @route '/hotels/{hotel}'
 */
destroy.delete = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\HotelController::destroy
 * @see app/Http/Controllers/HotelController.php:66
 * @route '/hotels/{hotel}'
 */
    const destroyForm = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\HotelController::destroy
 * @see app/Http/Controllers/HotelController.php:66
 * @route '/hotels/{hotel}'
 */
        destroyForm.delete = (args: { hotel: string | number } | [hotel: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const hotels = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default hotels