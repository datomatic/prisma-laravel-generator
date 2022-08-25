<?php

namespace App\Models\Prisma;

use App\Models\CategoryPost;
use App\Models\Post;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * PrismaCategory Model.
 *
 * @mixin Builder
 *
 * @method static      Builder|static query()
 * @method static      static make(array $attributes = [])
 * @method static      static create(array $attributes = [])
 * @method static      static forceCreate(array $attributes)
 * @method static      firstOrNew(array $attributes = [], array $values = [])
 * @method static      firstOrFail($columns = ['*'])
 * @method static      firstOrCreate(array $attributes, array $values = [])
 * @method static      firstOr($columns = ['*'], Closure $callback = null)
 * @method static      firstWhere($column, $operator = null, $value = null, $boolean = 'and')
 * @method static      updateOrCreate(array $attributes, array $values = [])
 * @method null|static first($columns = ['*'])
 * @method static      static findOrFail($id, $columns = ['*'])
 * @method static      static findOrNew($id, $columns = ['*'])
 * @method static      null|static find($id, $columns = ['*'])
 *
 * @property-read string $uuid
 * @property string $name
 * @property-read Collection<Post> $posts
 */
abstract class PrismaCategory extends Model
{
    public $incrementing = false;

    public $timestamps = false;
    protected $table = 'categories';

    protected $primaryKey = 'uuid';

    protected $keyType = 'string';

    protected $attributes;

    protected array $rules = [
        'uuid' => ['required', 'string', 'uuid'],
        'name' => ['required', 'string'],
    ];

    protected $casts = [
        'uuid' => 'string',
        'name' => 'string',
    ];

    public function __construct(array $attributes = [])
    {
        $this->attributes = [
            'uuid' => Str::orderedUuid(),
            ...$this->attributes ?? [],
        ];

        parent::__construct($attributes);
    }

    public function posts()
    {
        return $this->belongsToMany(
            Post::class,
            'categories_posts',
            'category_id',
            'post_id',
            'uuid',
            'uuid'
        )->using(CategoryPost::class);
    }
}
