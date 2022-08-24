<?php

namespace App\Models\Prisma;

use App\Enums\Prisma\Role;
use App\Models\Post;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * PrismaUser Model.
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
 * @property-read int $id
 * @property-read string $email
 * @property string  $password
 * @property ?string $first_name
 * @property ?string $last_name
 * @property Role    $role
 * @property-read CarbonImmutable $created_at
 * @property-read CarbonImmutable $updated_at
 * @property-read ?CarbonImmutable $deleted_at
 * @property-read Collection<Post> $posts
 */
abstract class PrismaUser extends Model implements AuthenticatableContract
{
    use Authenticatable;
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $table = 'users';

    protected $attributes;

    protected $guarded = ['id', 'password'];

    protected $hidden = ['password'];

    protected array $rules;

    protected $casts;

    public function __construct(array $attributes = [])
    {
        $this->attributes = [
            'role' => Role::GUEST,
            ...$this->attributes ?? [],
        ];
        $this->rules = [
            'id' => ['required', 'numeric', 'integer'],
            'email' => [
                Rule::unique('users', 'email')->ignore(
                    $this->getKey(),
                    $this->getKeyName()
                ),
                'required',
                'string',
            ],
            'password' => ['required', 'string'],
            'first_name' => ['nullable', 'string'],
            'last_name' => ['nullable', 'string'],
            'role' => ['required', new Enum(Role::class)],
            'created_at' => ['required', 'date'],
            'updated_at' => ['required', 'date'],
            'deleted_at' => ['nullable', 'date'],
            ...$this->rules ?? [],
        ];
        $this->casts = [
            'id' => 'integer',
            'email' => 'string',
            'password' => 'string',
            'first_name' => 'string',
            'last_name' => 'string',
            'role' => Role::class,
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
            'deleted_at' => 'immutable_datetime',
            ...$this->casts ?? [],
        ];
        parent::__construct($attributes);
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id', 'id');
    }
}
