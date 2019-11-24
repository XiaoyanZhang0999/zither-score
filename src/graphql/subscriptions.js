/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser($id: String!) {
  onCreateUser(id: $id) {
    id
    username
    email
    scores {
      items {
        id
        name
        createdAt
        updatedAt
        status
      }
      nextToken
    }
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser($id: String!) {
  onUpdateUser(id: $id) {
    id
    username
    email
    scores {
      items {
        id
        name
        createdAt
        updatedAt
        status
      }
      nextToken
    }
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser($id: String!) {
  onDeleteUser(id: $id) {
    id
    username
    email
    scores {
      items {
        id
        name
        createdAt
        updatedAt
        status
      }
      nextToken
    }
  }
}
`;
export const onCreateScore = `subscription OnCreateScore {
  onCreateScore {
    id
    name
    notes {
      items {
        id
        number
        dot
        doubleDot
        line
        doubleLine
        curve
        position
        scoreId
      }
      nextToken
    }
    user {
      id
      username
      email
      scores {
        nextToken
      }
    }
    createdAt
    updatedAt
    status
  }
}
`;
export const onUpdateScore = `subscription OnUpdateScore {
  onUpdateScore {
    id
    name
    notes {
      items {
        id
        number
        dot
        doubleDot
        line
        doubleLine
        curve
        position
        scoreId
      }
      nextToken
    }
    user {
      id
      username
      email
      scores {
        nextToken
      }
    }
    createdAt
    updatedAt
    status
  }
}
`;
export const onDeleteScore = `subscription OnDeleteScore {
  onDeleteScore {
    id
    name
    notes {
      items {
        id
        number
        dot
        doubleDot
        line
        doubleLine
        curve
        position
        scoreId
      }
      nextToken
    }
    user {
      id
      username
      email
      scores {
        nextToken
      }
    }
    createdAt
    updatedAt
    status
  }
}
`;
export const onCreateNote = `subscription OnCreateNote {
  onCreateNote {
    id
    number
    dot
    doubleDot
    line
    doubleLine
    curve
    position
    score {
      id
      name
      notes {
        nextToken
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
      status
    }
    scoreId
  }
}
`;
export const onUpdateNote = `subscription OnUpdateNote {
  onUpdateNote {
    id
    number
    dot
    doubleDot
    line
    doubleLine
    curve
    position
    score {
      id
      name
      notes {
        nextToken
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
      status
    }
    scoreId
  }
}
`;
export const onDeleteNote = `subscription OnDeleteNote {
  onDeleteNote {
    id
    number
    dot
    doubleDot
    line
    doubleLine
    curve
    position
    score {
      id
      name
      notes {
        nextToken
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
      status
    }
    scoreId
  }
}
`;
