<?php

namespace App\Models\Prisma;

use App\Models\Category;
use App\Models\CategoryPost;
use App\Models\User;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * PrismaPost Model.
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
 * @property-read string $uuid
 * @property string $title
 * @property string $content
 * @property-read CarbonImmutable $created_at
 * @property-read CarbonImmutable $updated_at
 * @property int $user_id
 * @property-read User $user
 * @property-read Category[]|Collection<Category> $categories
 */
abstract class PrismaPost extends Model
{
    public $incrementing = false;
    protected $table = 'posts';

    protected $primaryKey = 'uuid';

    protected $keyType = 'string';

    protected $attributes;

    protected $with = ['user'];

    protected array $rules = [
        'uuid' => ['required', 'string', 'uuid'],
        'title' => ['required', 'string'],
        'content' => ['required', 'string'],
        'created_at' => ['required', 'date'],
        'updated_at' => ['required', 'date'],
        'user_id' => ['required', 'numeric', 'integer'],
    ];

    protected $casts = [
        'uuid' => 'string',
        'title' => 'string',
        'content' => 'string',
        'created_at' => 'immutable_datetime',
        'updated_at' => 'immutable_datetime',
        'user_id' => 'integer',
    ];

    public function __construct(array $attributes = [])
    {
        $this->attributes = [
            'uuid' => Str::orderedUuid(),
            ...$this->attributes ?? [],
        ];

        parent::__construct($attributes);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'categories_posts',
            'post_id',
            'category_id',
            'uuid',
            'uuid'
        )
            ->using(CategoryPost::class)
            ->withPivot(CategoryPost::$PIVOT_FIELDS)
        ;
    }
}
