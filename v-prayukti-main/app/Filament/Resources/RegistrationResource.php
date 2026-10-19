<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RegistrationResource\Pages;
use App\Filament\Resources\RegistrationResource\RelationManagers;
use App\Models\Registration;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class RegistrationResource extends Resource
{
    protected static ?string $model = Registration::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';

    protected static ?string $navigationGroup = 'Master Hub';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('application_id')
                    ->required()->disabled(),
                Forms\Components\Select::make('event_id')
                    ->relationship('event','name')
                    ->required(),
                Forms\Components\TextInput::make('team_leader_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('team_leader_email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('team_leader_phone')
                    ->tel()
                    ->required()
                    ->maxLength(15),
                Forms\Components\TextInput::make('team_leader_department')
                    ->maxLength(255),
                Forms\Components\TextInput::make('team_leader_year')
                    ->numeric(),
                Forms\Components\TextInput::make('team_leader_college')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('account_holder_name')
                    ->maxLength(255),
                Forms\Components\TextInput::make('team_name')
                    ->maxLength(255),
                Forms\Components\TextInput::make('team_count')
                    ->required()
                    ->numeric(),
                Forms\Components\TextInput::make('team_members'),
                Forms\Components\TextInput::make('transaction_amount')
                    ->required()
                    ->numeric(),
                FileUpload::make('proof_of_payment_url')
                ->label('Image Upload')
                ->image() // Ensures the file is an image
                ->disk('public') // Save the file to the 'public' disk
                ->directory('payment_proofs') // Folder where the image will be stored
                ->visibility('public') // Make the image publicly accessible
                ->required()
                ->disabled(),
                Forms\Components\TextInput::make('ticket_id')
                    ->maxLength(50),                
                Forms\Components\TextInput::make('transaction_id')
                    ->required()
                    ->maxLength(50),
                Forms\Components\TextInput::make('payment_status')
                    ->maxLength(50)
                    ->default('Pending'),
                Forms\Components\DateTimePicker::make('registered_at'),
                Select::make('status')
                    ->label('Status')
                    ->options([
                        'Pending' => 'Pending',
                        'Approved' => 'Approved',
                        'Rejected' => 'Rejected',
                        ])
                    ->native(false)
                    ->required(),
                Forms\Components\Select::make('arrival_status')
                        ->options([
                        'Not Verified' => 'Not Verified',
                        'Verified' => 'Verified'   
                        ])->native(false)
                        ->required(),
                Forms\Components\Textarea::make('remark')
                    ->columnSpanFull(),
                
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('application_id')
                    ->searchable(),
                Tables\Columns\TextColumn::make('event.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('team_leader_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('team_leader_email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('team_leader_phone')
                    ->searchable(),
                Tables\Columns\TextColumn::make('team_leader_department')
                    ->searchable(),
                Tables\Columns\TextColumn::make('team_leader_year')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('team_leader_college')
                    ->searchable(),
                Tables\Columns\TextColumn::make('account_holder_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('team_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('team_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('ticket_id')
                    ->searchable(),
                Tables\Columns\TextColumn::make('transaction_amount')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('transaction_id')
                    ->searchable(),
                Tables\Columns\TextColumn::make('payment_status')
                    ->searchable(),
                Tables\Columns\TextColumn::make('registered_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->searchable(),
                Tables\Columns\TextColumn::make('arrival_status')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListRegistrations::route('/'),
            'create' => Pages\CreateRegistration::route('/create'),
            'edit' => Pages\EditRegistration::route('/{record}/edit'),
        ];
    }
}
