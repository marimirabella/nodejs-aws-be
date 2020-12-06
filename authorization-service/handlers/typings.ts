export enum APIGatewayEventType {
  Token = 'TOKEN',
}

export enum AuthorizationError {
  Unauthorized = 'Unauthorized',
  InvalidToken = 'Invalid token'
}

export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}
