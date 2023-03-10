Rails.application.routes.draw do
  resources :regulations

  devise_for :admins, controllers: {
    registrations: 'admins/registrations',
    sessions: 'admins/sessions'
  }

  devise_for :users, controllers: {
    registrations: 'users/registrations',
    sessions: 'users/sessions'
  }
  
  resources :occupations   do
    collection do
      get :of_tday
    end
    collection do
      get :admin
    end
  end

  resources :calenders
  resources :rooms
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "rooms#index"
end
