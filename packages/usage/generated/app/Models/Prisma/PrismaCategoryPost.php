<?php

namespace App\Models\Prisma;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * PrismaCategoryPost Model.
 *
 * @mixin Builder
 *
 * @method static Builder|static query()
 * @method static static         make(array $attributes = [])
 * @method static static         create(array $attributes = [])
 * @method static static         forceCreate(array $attributes)
 * @method        static         firstOrNew(array $attributes = [], array $values = [])
 * @method        static         firstOrFail($columns = ['*'])
 * @method        static         firstOrCreate(array $attributes, array $values = [])
 * @method        static         firstOr($columns = ['*'], Closure $callback = null)
 * @method        static         firstWhere($column, $operator = null, $value = null, $boolean = 'and')
 * @method        static         updateOrCreate(array $attributes, array $values = [])
 * @method        null|static    first($columns = ['*'])
 * @method static static         findOrFail($id, $columns = ['*'])
 * @method static static         findOrNew($id, $columns = ['*'])
 * @method static null|static    find($id, $columns = ['*'])
 *
 * @property-read int $id
 * @property string $post_id
 * @property string $category_id
 * @property float  $affinity
 */
abstract class PrismaCategoryPost extends Pivot
{
    public static array $PIVOT_FIELDS = [
        'id',
        'post_id',
        'category_id',
        'affinity',
    ];

    public $incrementing = true;

    public $timestamps = false;
    protected $table = 'categories_posts';

    protected $attributes = [
        'affinity' => 1,
    ];

    protected array $rules = [
        'id' => ['required', 'numeric', 'integer'],
        'post_id' => ['required', 'string'],
        'category_id' => ['required', 'string'],
        'affinity' => ['required', 'numeric'],
    ];

    protected $casts = [
        'id' => 'integer',
        'post_id' => 'string',
        'category_id' => 'string',
        'affinity' => 'double',
    ];
}
